import { isValidObjectId } from 'mongoose';
import {
	InvalidId,
	InvalidParameter,
	GuestNotFound,
	BookingNotFound,
	UnknownError,
} from '../classes/errors.class';
import { Guest, GuestsWithPagination } from '../interfaces/guests.interface';
import guestModel from '../models/guests.model';
import bookingModel from '../models/bookings.model';

// Verifica se os elementos de bookingIds são válidos.
const validateBookingIds = async (bookingIds: string[]): Promise<void> => {
	// Filtra os elementos duplicados.
	bookingIds.filter((element, index) => {
		if (bookingIds.indexOf(element) !== index) bookingIds.splice(index, 1);
	});

	const promises = [];

	for (const bookingId of bookingIds) {
		// Verifica se o ID é válido.
		if (!isValidObjectId(bookingId)) throw new InvalidId(bookingId);

		promises.push(bookingModel.findById(bookingId));
	}

	const bookings = await Promise.all(promises);

	for (let i = 0; i < bookings.length; i++) {
		// Verifica se o elemento existe.
		if (!bookings[i]) throw new BookingNotFound(bookingIds[i]);
	}
};

// Adiciona o hóspede em todas as reservas presentes em bookingIds.
const addGuestToBookings = async (guestId: string, bookingIds: string[]): Promise<void> => {
	const promises = [];

	for (const bookingId of bookingIds) {
		const booking = await bookingModel.findById(bookingId);

		// Se o ID do hóspede está presente, então pulamos para a próxima iteração.
		if (booking!.guestIds.find((id) => id === guestId)) continue;

		booking!.guestIds.push(guestId);

		promises.push(bookingModel.findByIdAndUpdate(bookingId, booking!));
	}

	await Promise.all(promises);
};

// Remove o hóspede de todas as reservas presentes em bookingIds.
const removeGuestFromBookings = async (guestId: string, bookingIds: string[]): Promise<void> => {
	const promises = [];

	for (const bookingId of bookingIds) {
		const booking = await bookingModel.findById(bookingId);
		const guestIdIndex = booking!.guestIds.indexOf(guestId);

		// Se o ID do hóspede não está presente, então pulamos para a próxima iteração.
		if (guestIdIndex < 0) continue;

		booking!.guestIds.splice(guestIdIndex, 1);

		promises.push(bookingModel.findByIdAndUpdate(bookingId, booking!));
	}

	await Promise.all(promises);
};

const getGuests = async (
	page: number,
	limit: number,
	bookingId?: string
): Promise<GuestsWithPagination> => {
	try {
		if (!page || page < 1) throw new InvalidParameter('page');
		if (!limit || limit < 1) throw new InvalidParameter('limit');

		let query = {};

		if (bookingId) {
			if (!isValidObjectId(bookingId)) throw new InvalidParameter('bookingId');

			query = { bookingIds: bookingId };
		}

		const [totalCount, guests] = await Promise.all([
			guestModel.estimatedDocumentCount(),
			guestModel
				.find(query)
				.limit(limit)
				.skip((page - 1) * limit),
		]);
		if (!guests) throw new UnknownError();

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
	} catch (error) {
		throw error;
	}
};

const getGuestById = async (guestId: string): Promise<Guest> => {
	try {
		if (!isValidObjectId(guestId)) throw new InvalidId(guestId);

		const guest = await guestModel.findById(guestId);
		if (!guest) throw new GuestNotFound(guestId);

		return guest;
	} catch (error) {
		throw error;
	}
};

const createGuest = async (guest: Guest): Promise<Guest> => {
	const { name, email, birthdate, phoneNumber, city, state, country, bookingIds } = guest;

	try {
		if (bookingIds) await validateBookingIds(bookingIds);

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
		if (!createdGuest) throw new UnknownError();

		if (bookingIds) await addGuestToBookings(createdGuest.id, bookingIds);

		return createdGuest;
	} catch (error) {
		throw error;
	}
};

const updateGuest = async (guestId: string, guest: Guest): Promise<Guest> => {
	const { name, email, birthdate, phoneNumber, city, state, country, bookingIds } = guest;

	try {
		if (!isValidObjectId(guestId)) throw new InvalidId(guestId);

		if (bookingIds) await validateBookingIds(bookingIds);

		const oldGuest = await guestModel.findById(guestId);
		if (!oldGuest) throw new GuestNotFound(guestId);

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
			}
		);
		if (!updatedGuest) throw new UnknownError();

		if (oldGuest.bookingIds) await removeGuestFromBookings(guestId, oldGuest.bookingIds);
		if (updatedGuest.bookingIds) await addGuestToBookings(guestId, updatedGuest.bookingIds);

		return updatedGuest;
	} catch (error) {
		throw error;
	}
};

const deleteGuest = async (guestId: string): Promise<Guest> => {
	try {
		if (!isValidObjectId(guestId)) throw new InvalidId(guestId);

		const deletedGuest = await guestModel.findByIdAndRemove(guestId);
		if (!deletedGuest) throw new GuestNotFound(guestId);

		if (deletedGuest.bookingIds) await removeGuestFromBookings(guestId, deletedGuest.bookingIds);

		return deletedGuest;
	} catch (error) {
		throw error;
	}
};

export default { getGuests, getGuestById, createGuest, updateGuest, deleteGuest };
