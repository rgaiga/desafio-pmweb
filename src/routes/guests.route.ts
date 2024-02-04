/* eslint-disable  @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import {
    getGuestsHandler,
    getGuestByIdHandler,
    createGuestHandler,
    updateGuestHandler,
    deleteGuestHandler,
} from '@controllers';

const guestsRouter = Router();

guestsRouter.get('/', getGuestsHandler);
guestsRouter.get('/:guestId', getGuestByIdHandler);
guestsRouter.post('/', createGuestHandler);
guestsRouter.put('/:guestId', updateGuestHandler);
guestsRouter.delete('/:guestId', deleteGuestHandler);

export { guestsRouter };
