import { isValidObjectId } from 'mongoose';
import { guestModel, bookingModel } from '@models';
import { Guest } from '@models/interfaces';
import {
    CreateGuestDTO,
    UpdateGuestDTO,
    Pagination,
} from '@services/interfaces';
import {
    InvalidIdError,
    InvalidParameterError,
    GuestNotFoundError,
    BookingNotFoundError,
    InternalServerError,
} from '@errors';

export async function getGuests(
    page: number,
    limit: number,
    bookingId?: string,
): Promise<Pagination<Guest>> {
    if (!page || page < 1) throw new InvalidParameterError('page');
    if (!limit || limit < 1) throw new InvalidParameterError('limit');

    let query = {};

    if (bookingId) {
        if (!isValidObjectId(bookingId))
            throw new InvalidParameterError('bookingId');

        query = { bookingIds: bookingId };
    }

    const [totalCount, guests] = await Promise.all([
        guestModel.estimatedDocumentCount(),
        guestModel
            .find(query)
            .limit(limit)
            .skip((page - 1) * limit),
    ]);

    const count = guests.length;
    const totalPages = Math.ceil(totalCount / limit);

    return {
        pagination: {
            page,
            limit,
            count,
            totalPages,
            totalCount,
        },
        data: guests,
    };
}

export async function getGuestById(guestId: string): Promise<Guest> {
    if (!isValidObjectId(guestId)) throw new InvalidIdError(guestId);

    const guest = await guestModel.findById(guestId);
    if (!guest) throw new GuestNotFoundError(guestId);

    return guest;
}

export async function createGuest(data: CreateGuestDTO): Promise<Guest> {
    const {
        name,
        email,
        birthdate,
        phoneNumber,
        city,
        state,
        country,
        bookingIds,
    } = data;

    if (bookingIds.length > 0)
        // Filtra os elementos duplicados.
        await validateBookingIds([...new Set(bookingIds)]);

    const createdGuest = await guestModel.create({
        name,
        email,
        birthdate,
        phoneNumber,
        city,
        state,
        country,
        bookingIds,
    });

    if (bookingIds.length > 0)
        await addGuestToBookings(createdGuest._id.toString(), bookingIds);

    return createdGuest;
}

export async function updateGuest(
    guestId: string,
    data: UpdateGuestDTO,
): Promise<Guest> {
    const {
        name,
        email,
        birthdate,
        phoneNumber,
        city,
        state,
        country,
        bookingIds,
    } = data;

    if (!isValidObjectId(guestId)) throw new InvalidIdError(guestId);

    if (bookingIds && bookingIds.length > 0)
        // Filtra os elementos duplicados.
        await validateBookingIds([...new Set(bookingIds)]);

    const oldGuest = await guestModel.findById(guestId);
    if (!oldGuest) throw new GuestNotFoundError(guestId);

    const updatedGuest = await guestModel.findByIdAndUpdate(
        guestId,
        {
            name,
            email,
            birthdate,
            phoneNumber,
            city,
            state,
            country,
            bookingIds,
        },
        {
            new: true,
            runValidators: true,
        },
    );
    if (!updatedGuest)
        throw new InternalServerError(
            'updateGuest(): guestModel.findByIdAndUpdate() returned a falsy value.',
        );

    if (oldGuest.bookingIds.length > 0)
        await removeGuestFromBookings(guestId, oldGuest.bookingIds);
    if (updatedGuest.bookingIds.length > 0)
        await addGuestToBookings(guestId, updatedGuest.bookingIds);

    return updatedGuest;
}

export async function deleteGuest(guestId: string): Promise<Guest> {
    if (!isValidObjectId(guestId)) throw new InvalidIdError(guestId);

    const deletedGuest = await guestModel.findByIdAndDelete(guestId);
    if (!deletedGuest) throw new GuestNotFoundError(guestId);

    if (deletedGuest.bookingIds.length > 0)
        await removeGuestFromBookings(guestId, deletedGuest.bookingIds);

    return deletedGuest;
}

// Verifica se os elementos de bookingIds são válidos.
async function validateBookingIds(bookingIds: string[]): Promise<void> {
    const promises = [];

    for (const bookingId of bookingIds) {
        if (!isValidObjectId(bookingId)) throw new InvalidIdError(bookingId);

        promises.push(bookingModel.findById(bookingId));
    }

    const bookings = await Promise.all(promises);

    for (let i = 0; i < bookings.length; i++) {
        if (!bookings[i]) throw new BookingNotFoundError(bookingIds[i]);
    }
}

// Adiciona o hóspede em todas as reservas presentes em bookingIds.
async function addGuestToBookings(
    guestId: string,
    bookingIds: string[],
): Promise<void> {
    const promises = [];

    for (const bookingId of bookingIds) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking)
            throw new InternalServerError(
                'addGuestToBookings(): could not find booking in bookingIds.',
            );

        // Se o ID do hóspede está presente, então pulamos para a próxima iteração.
        if (booking.guestIds.find((id) => id === guestId)) continue;

        booking.guestIds.push(guestId);

        promises.push(bookingModel.findByIdAndUpdate(bookingId, booking));
    }

    await Promise.all(promises);
}

// Remove o hóspede de todas as reservas presentes em bookingIds.
async function removeGuestFromBookings(
    guestId: string,
    bookingIds: string[],
): Promise<void> {
    const promises = [];

    for (const bookingId of bookingIds) {
        const booking = await bookingModel.findById(bookingId);
        if (!booking)
            throw new InternalServerError(
                'removeGuestFromBookings(): could not find booking in bookingIds.',
            );

        const guestIdIndex = booking.guestIds.indexOf(guestId);

        // Se o ID do hóspede não está presente, então pulamos para a próxima iteração.
        if (guestIdIndex < 0) continue;

        booking.guestIds.splice(guestIdIndex, 1);

        promises.push(bookingModel.findByIdAndUpdate(bookingId, booking));
    }

    await Promise.all(promises);
}
