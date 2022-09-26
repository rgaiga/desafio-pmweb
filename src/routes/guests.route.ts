/* istanbul ignore file */
import express from 'express';
import guestsController from '../controllers/guests.controller';

const router = express.Router();

router.get('/', guestsController.getGuests);
router.get('/:guestId', guestsController.getGuestById);
router.post('/', guestsController.createGuest);
router.put('/:guestId', guestsController.updateGuest);
router.delete('/:guestId', guestsController.deleteGuest);

export default router;
