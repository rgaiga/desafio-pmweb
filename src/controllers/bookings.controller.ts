import { Request, Response, NextFunction } from 'express';
import { bookingsService } from '@services';
import { CreateBookingDTO, UpdateBookingDTO } from '@services/interfaces';

export const getBookingsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const guestId = req.query.bookingId as string;
    let page = parseInt(req.query.page as string);
    let limit = parseInt(req.query.limit as string);

    if (!page) page = 1;
    if (!limit) limit = 10;

    try {
        const bookings = await bookingsService.getBookings(
            page,
            limit,
            guestId,
        );

        res.send(bookings);
    } catch (error) {
        next(error);
    }
};

export const getBookingByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { bookingId } = req.params;

    try {
        const booking = await bookingsService.getBookingById(bookingId);

        res.send(booking);
    } catch (error) {
        next(error);
    }
};

export const createBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const {
        hotelName,
        roomNumber,
        price,
        bookingDate,
        startDate,
        endDate,
        status,
        guestIds,
    } = req.body as CreateBookingDTO;

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

export const updateBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { bookingId } = req.params;
    const {
        hotelName,
        roomNumber,
        price,
        bookingDate,
        startDate,
        endDate,
        status,
        guestIds,
    } = req.body as UpdateBookingDTO;

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

export const deleteBookingHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { bookingId } = req.params;

    try {
        await bookingsService.deleteBooking(bookingId);

        res.status(204).send(null);
    } catch (error) {
        next(error);
    }
};
