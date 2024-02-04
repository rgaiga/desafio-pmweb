import { Request, Response, NextFunction } from 'express';
import { guestsService } from '@services';
import { CreateGuestDTO, UpdateGuestDTO } from '@services/interfaces';

export const getGuestsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const bookingId = req.query.bookingId as string;
    let page = parseInt(req.query.page as string);
    let limit = parseInt(req.query.limit as string);

    if (!page) page = 1;
    if (!limit) limit = 10;

    try {
        const guests = await guestsService.getGuests(page, limit, bookingId);

        res.send(guests);
    } catch (error) {
        next(error);
    }
};

export const getGuestByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { guestId } = req.params;

    try {
        const guest = await guestsService.getGuestById(guestId);

        res.send(guest);
    } catch (error) {
        next(error);
    }
};

export const createGuestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const {
        name,
        email,
        birthdate,
        phoneNumber,
        city,
        state,
        country,
        bookingIds,
    } = req.body as CreateGuestDTO;

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

export const updateGuestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { guestId } = req.params;
    const {
        name,
        email,
        birthdate,
        phoneNumber,
        city,
        state,
        country,
        bookingIds,
    } = req.body as UpdateGuestDTO;

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

export const deleteGuestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const { guestId } = req.params;

    try {
        await guestsService.deleteGuest(guestId);

        res.status(204).send(null);
    } catch (error) {
        next(error);
    }
};
