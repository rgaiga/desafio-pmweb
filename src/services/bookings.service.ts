import { isValidObjectId } from 'mongoose';
import { bookingModel, guestModel } from '@models';
import { Booking } from '@models/interfaces';
import {
    CreateBookingDTO,
    UpdateBookingDTO,
    Pagination,
} from '@services/interfaces';
import {
    InvalidIdError,
    InvalidParameterError,
    GuestNotFoundError,
    BookingNotFoundError,
    InternalServerError,
} from '@errors';

export async function getBookings(
    page: number,
    limit: number,
    guestId?: string,
): Promise<Pagination<Booking>> {
    if (!page || page < 1) throw new InvalidParameterError('page');
    if (!limit || limit < 1) throw new InvalidParameterError('limit');

    let query = {};

    if (guestId) {
        if (!isValidObjectId(guestId))
            throw new InvalidParameterError('guestId');

        query = { guestIds: guestId };
    }

    const [totalCount, bookings] = await Promise.all([
        bookingModel.estimatedDocumentCount(),
        bookingModel
            .find(query)
            .limit(limit)
            .skip((page - 1) * limit),
    ]);

    const count = bookings.length;
    const totalPages = Math.ceil(count / limit);

    return {
        pagination: {
            page,
            limit,
            count,
            totalPages,
            totalCount,
        },
        data: bookings,
    };
}

export async function getBookingById(bookingId: string): Promise<Booking> {
    if (!isValidObjectId(bookingId)) throw new InvalidIdError(bookingId);

    const booking = await bookingModel.findById(bookingId);
    if (!booking) throw new BookingNotFoundError(bookingId);

    return booking;
}

export async function createBooking(data: CreateBookingDTO): Promise<Booking> {
    const {
        hotelName,
        roomNumber,
        price,
        bookingDate,
        startDate,
        endDate,
        status,
        guestIds,
    } = data;

    if (guestIds.length > 0)
        // Filtra os elementos duplicados.
        await validateGuestIds([...new Set(guestIds)]);

    const createdBooking = await bookingModel.create({
        hotelName,
        roomNumber,
        price,
        bookingDate,
        startDate,
        endDate,
        status,
        guestIds,
    });

    if (guestIds.length > 0)
        await addBookingToGuests(createdBooking._id.toString(), guestIds);

    return createdBooking;
}

export async function updateBooking(
    bookingId: string,
    data: UpdateBookingDTO,
): Promise<Booking> {
    const {
        hotelName,
        roomNumber,
        price,
        bookingDate,
        startDate,
        endDate,
        status,
        guestIds,
    } = data;

    if (!isValidObjectId(bookingId)) throw new InvalidIdError(bookingId);

    if (guestIds && guestIds.length > 0)
        // Filtra os elementos duplicados.
        await validateGuestIds([...new Set(guestIds)]);

    const oldBooking = await bookingModel.findById(bookingId);
    if (!oldBooking) throw new BookingNotFoundError(bookingId);

    const updatedBooking = await bookingModel.findByIdAndUpdate(
        bookingId,
        {
            hotelName,
            roomNumber,
            price,
            bookingDate,
            startDate,
            endDate,
            status,
            guestIds,
        },
        {
            new: true,
            runValidators: true,
        },
    );
    if (!updatedBooking)
        throw new InternalServerError(
            'updateBooking(): bookingModel.findByIdAndUpdate() returned a falsy value.',
        );

    if (oldBooking.guestIds.length > 0)
        await removeBookingFromGuests(bookingId, oldBooking.guestIds);
    if (updatedBooking.guestIds.length > 0)
        await addBookingToGuests(bookingId, updatedBooking.guestIds);

    return updatedBooking;
}

export async function deleteBooking(bookingId: string): Promise<Booking> {
    if (!isValidObjectId(bookingId)) throw new InvalidIdError(bookingId);

    const deletedBooking = await bookingModel.findByIdAndDelete(bookingId);
    if (!deletedBooking) throw new BookingNotFoundError(bookingId);

    await removeBookingFromGuests(bookingId, deletedBooking.guestIds);

    return deletedBooking;
}

// Verifica se os elementos de guestIds são válidos.
async function validateGuestIds(guestIds: string[]): Promise<void> {
    // Filtra os elementos duplicados.
    guestIds = [...new Set(guestIds)];

    const promises = [];

    for (const guestId of guestIds) {
        if (!isValidObjectId(guestId)) throw new InvalidIdError(guestId);

        promises.push(guestModel.findById(guestId));
    }

    const guests = await Promise.all(promises);

    for (let i = 0; i < guests.length; i++) {
        if (!guests[i]) throw new GuestNotFoundError(guestIds[i]);
    }
}

// Adiciona a reserva em todos os hóspedes presentes em guestIds.
async function addBookingToGuests(
    bookingId: string,
    guestIds: string[],
): Promise<void> {
    const promises = [];

    for (const guestId of guestIds) {
        const guest = await guestModel.findById(guestId);
        if (!guest)
            throw new InternalServerError(
                'addBookingToGuests(): could not find guest in guestIds.',
            );

        // Se o ID da reserva está presente, então pulamos para a próxima iteração.
        if (guest.bookingIds.find((id) => id === bookingId)) continue;

        guest.bookingIds.push(bookingId);

        promises.push(guestModel.findByIdAndUpdate(guestId, guest));
    }

    await Promise.all(promises);
}

// Remove a reserva de todos os hóspedes presentes em guestIds.
async function removeBookingFromGuests(
    bookingId: string,
    guestIds: string[],
): Promise<void> {
    const promises = [];

    for (const guestId of guestIds) {
        const guest = await guestModel.findById(guestId);
        if (!guest)
            throw new InternalServerError(
                'removeBookingFromGuests(): could not find guest in guestIds.',
            );

        const bookingIdIndex = guest.bookingIds.indexOf(bookingId);

        // Se o ID do hóspede não está presente, então pulamos para a próxima iteração.
        if (bookingIdIndex < 0) continue;

        guest.bookingIds.splice(bookingIdIndex, 1);

        promises.push(guestModel.findByIdAndUpdate(guestId, guest));
    }

    await Promise.all(promises);
}
