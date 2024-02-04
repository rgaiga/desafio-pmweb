/* eslint-disable  @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import {
    getBookingsHandler,
    getBookingByIdHandler,
    createBookingHandler,
    updateBookingHandler,
    deleteBookingHandler,
} from '@controllers';

const bookingsRouter = Router();

bookingsRouter.get('/', getBookingsHandler);
bookingsRouter.get('/:bookingId', getBookingByIdHandler);
bookingsRouter.post('/', createBookingHandler);
bookingsRouter.put('/:bookingId', updateBookingHandler);
bookingsRouter.delete('/:bookingId', deleteBookingHandler);

export { bookingsRouter };
