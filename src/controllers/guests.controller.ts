import { Request, Response, NextFunction } from 'express';
import guestsService from '../services/guests.service';

const getGuests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	let page: string | number = req.query.page as string;
	let limit: string | number = req.query.limit as string;
	const bookingId = req.query.bookingId as string;

	!page ? (page = 1) : (page = parseInt(page));
	!limit ? (limit = 10) : (limit = parseInt(limit));

	try {
		const guests = await guestsService.getGuests(page, limit, bookingId);

		res.send(guests);
	} catch (error) {
		next(error);
	}
};

const getGuestById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { guestId } = req.params;

	try {
		const guest = await guestsService.getGuestById(guestId);

		res.send(guest);
	} catch (error) {
		next(error);
	}
};

const createGuest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { name, email, birthdate, phoneNumber, city, state, country, bookingIds } = req.body;

	try {
		const createdGuest = await guestsService.createGuest({
			name,
			email,
			birthdate,
			phoneNumber,
			city,
			state,
			country,
			bookingIds,
		});

		res.status(201).send(createdGuest);
	} catch (error) {
		next(error);
	}
};

const updateGuest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { guestId } = req.params;
	const { name, email, birthdate, phoneNumber, city, state, country, bookingIds } = req.body;

	try {
		const updatedGuest = await guestsService.updateGuest(guestId, {
			name,
			email,
			birthdate,
			phoneNumber,
			city,
			state,
			country,
			bookingIds,
		});

		res.send(updatedGuest);
	} catch (error) {
		next(error);
	}
};

const deleteGuest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { guestId } = req.params;

	try {
		await guestsService.deleteGuest(guestId);

		res.status(204).send(null);
	} catch (error) {
		next(error);
	}
};

export default { getGuests, getGuestById, createGuest, updateGuest, deleteGuest };
