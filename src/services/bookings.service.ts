import { isValidObjectId } from 'mongoose';
import {
	InvalidId,
	InvalidParameter,
	GuestNotFound,
	BookingNotFound,
	UnknownError,
} from '../classes/errors.class';
import { Booking, BookingsWithPagination } from '../interfaces/bookings.interface';
import bookingModel from '../models/bookings.model';
import guestModel from '../models/guests.model';

// Verifica se os elementos de guestIds são válidos.
const validateGuestIds = async (guestIds: string[]): Promise<void> => {
	// Filtra os elementos duplicados.
	guestIds.filter((element, index) => {
		if (guestIds.indexOf(element) !== index) guestIds.splice(index, 1);
	});

	const promises = [];

	for (const guestId of guestIds) {
		// Verifica se o ID é válido.
		if (!isValidObjectId(guestId)) throw new InvalidId(guestId);

		promises.push(guestModel.findById(guestId));
	}

	const guests = await Promise.all(promises);

	for (let i = 0; i < guests.length; i++) {
		// Verifica se o elemento existe.
		if (!guests[i]) throw new GuestNotFound(guestIds[i]);
	}
};

// Adiciona a reserva em todos os hóspedes presentes em guestIds.
const addBookingToGuests = async (bookingId: string, guestIds: string[]): Promise<void> => {
	const promises = [];

	for (const guestId of guestIds) {
		const guest = await guestModel.findById(guestId);

		// Se o ID da reserva está presente, então pulamos para a próxima iteração.
		if (guest!.bookingIds.find((id) => id === bookingId)) continue;

		guest!.bookingIds.push(bookingId);

		promises.push(guestModel.findByIdAndUpdate(guestId, guest!));
	}

	await Promise.all(promises);
};

// Remove a reserva de todos os hóspedes presentes em guestIds.
const removeBookingFromGuests = async (bookingId: string, guestIds: string[]): Promise<void> => {
	const promises = [];

	for (const guestId of guestIds) {
		const guest = await guestModel.findById(guestId);
		const bookingIdIndex = guest!.bookingIds.indexOf(bookingId);

		// Se o ID do hóspede não está presente, então pulamos para a próxima iteração.
		if (bookingIdIndex < 0) continue;

		guest!.bookingIds.splice(bookingIdIndex, 1);

		promises.push(guestModel.findByIdAndUpdate(guestId, guest!));
	}

	await Promise.all(promises);
};

const getBookings = async (
	page: number,
	limit: number,
	guestId?: string
): Promise<BookingsWithPagination> => {
	try {
		if (!page || page < 1) throw new InvalidParameter('page');
		if (!limit || limit < 1) throw new InvalidParameter('limit');

		let query = {};

		if (guestId) {
			if (!isValidObjectId(guestId)) throw new InvalidParameter('guestId');

			query = { guestIds: guestId };
		}

		const [totalCount, bookings] = await Promise.all([
			bookingModel.estimatedDocumentCount(),
			bookingModel
				.find(query)
				.limit(limit)
				.skip((page - 1) * limit),
		]);
		if (!bookings) throw new UnknownError();

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
	} catch (error) {
		throw error;
	}
};

const getBookingById = async (bookingId: string): Promise<Booking> => {
	try {
		if (!isValidObjectId(bookingId)) throw new InvalidId(bookingId);

		const booking = await bookingModel.findById(bookingId);
		if (!booking) throw new BookingNotFound(bookingId);

		return booking;
	} catch (error) {
		throw error;
	}
};

const createBooking = async (booking: Booking): Promise<Booking> => {
	const { hotelName, roomNumber, price, bookingDate, startDate, endDate, status, guestIds } =
		booking;

	try {
		if (guestIds) await validateGuestIds(guestIds);

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
		if (!createdBooking) throw new UnknownError();

		if (guestIds) await addBookingToGuests(createdBooking.id, guestIds);

		return createdBooking;
	} catch (error) {
		throw error;
	}
};

const updateBooking = async (bookingId: string, booking: Booking): Promise<Booking> => {
	const { hotelName, roomNumber, price, bookingDate, startDate, endDate, status, guestIds } =
		booking;

	try {
		if (!isValidObjectId(bookingId)) throw new InvalidId(bookingId);

		if (guestIds) await validateGuestIds(guestIds);

		const oldBooking = await bookingModel.findById(bookingId);
		if (!oldBooking) throw new BookingNotFound(bookingId);

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
			}
		);
		if (!updatedBooking) throw new UnknownError();

		if (oldBooking.guestIds) await removeBookingFromGuests(bookingId, oldBooking.guestIds);
		if (updatedBooking.guestIds) await addBookingToGuests(bookingId, updatedBooking.guestIds);

		return updatedBooking;
	} catch (error) {
		throw error;
	}
};

const deleteBooking = async (bookingId: string): Promise<Booking> => {
	try {
		if (!isValidObjectId(bookingId)) throw new InvalidId(bookingId);

		const deletedBooking = await bookingModel.findByIdAndRemove(bookingId);
		if (!deletedBooking) throw new BookingNotFound(bookingId);

		await removeBookingFromGuests(bookingId, deletedBooking.guestIds);

		return deletedBooking;
	} catch (error) {
		throw error;
	}
};

export default { getBookings, getBookingById, createBooking, updateBooking, deleteBooking };
