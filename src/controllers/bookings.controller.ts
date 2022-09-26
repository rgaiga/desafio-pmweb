import { Request, Response, NextFunction } from 'express';
import bookingsService from '../services/bookings.service';

const getBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let page: string | number = req.query.page as string;
	let limit: string | number = req.query.limit as string;
	const guestId = req.query.bookingId as string;

	!page ? (page = 1) : (page = parseInt(page));
	!limit ? (limit = 10) : (limit = parseInt(limit));

	try {
		const bookings = await bookingsService.getBookings(page, limit, guestId);

		res.send(bookings);
	} catch (error) {
		next(error);
	}
};

const getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { bookingId } = req.params;

	try {
		const booking = await bookingsService.getBookingById(bookingId);

		res.send(booking);
	} catch (error) {
		next(error);
	}
};

const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { hotelName, roomNumber, price, bookingDate, startDate, endDate, status, guestIds } =
		req.body;

	try {
		const createdBooking = await bookingsService.createBooking({
			hotelName,
			roomNumber,
			price,
			bookingDate,
			startDate,
			endDate,
			status,
			guestIds,
		});

		res.status(201).send(createdBooking);
	} catch (error) {
		next(error);
	}
};

const updateBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { bookingId } = req.params;
	const { hotelName, roomNumber, price, bookingDate, startDate, endDate, status, guestIds } =
		req.body;

	try {
		const updatedBooking = await bookingsService.updateBooking(bookingId, {
			hotelName,
			roomNumber,
			price,
			bookingDate,
			startDate,
			endDate,
			status,
			guestIds,
		});

		res.send(updatedBooking);
	} catch (error) {
		next(error);
	}
};

const deleteBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { bookingId } = req.params;

	try {
		await bookingsService.deleteBooking(bookingId);

		res.status(204).send(null);
	} catch (error) {
		next(error);
	}
};

export default { getBookings, getBookingById, createBooking, updateBooking, deleteBooking };
