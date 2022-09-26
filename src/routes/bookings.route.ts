/* istanbul ignore file */
import express from 'express';
import bookingsController from '../controllers/bookings.controller';

const router = express.Router();

router.get('/', bookingsController.getBookings);
router.get('/:bookingId', bookingsController.getBookingById);
router.post('/', bookingsController.createBooking);
router.put('/:bookingId', bookingsController.updateBooking);
router.delete('/:bookingId', bookingsController.deleteBooking);

export default router;
