// @ts-nocheck
import { guestModel } from '@models';
import { guestsService } from '@services';
import {
    InvalidIdError,
    InvalidParameterError,
    GuestNotFoundError,
} from '@errors';
import { guestStub } from '../stubs/guests.stub';

jest.mock('../../src/models/guests.model');
jest.mock('../../src/models/bookings.model');

describe('Guests Service', () => {
    describe('getGuests()', () => {
        const expectedResponse = {
            pagination: {
                page: 1,
                limit: 10,
                count: 1,
                totalPages: 1,
                totalCount: 1,
            },
            data: [guestStub],
        };

        it('should return all guests', async () => {
            const page = 1;
            const limit = 10;

            const guests = await guestsService.getGuests(page, limit);

            expect(guests).toEqual(expectedResponse);
        });

        it('should return all guests with matching "bookingId"', async () => {
            const page = 1;
            const limit = 10;
            const bookingId = guestStub.bookingIds[0];

            const guests = await guestsService.getGuests(
                page,
                limit,
                bookingId,
            );

            expect(guests).toEqual(expectedResponse);
        });

        it('should throw "InvalidParameterError" when given an invalid "page"', async () => {
            const page = undefined;
            const limit = 10;
            const bookingId = guestStub.bookingIds[0];

            await expect(() =>
                guestsService.getGuests(page, limit, bookingId),
            ).rejects.toThrow(InvalidParameterError);
        });

        it('should throw "InvalidParameterError" when given an invalid "limit"', async () => {
            const page = 1;
            const limit = undefined;
            const bookingId = guestStub.bookingIds[0];

            await expect(() =>
                guestsService.getGuests(page, limit, bookingId),
            ).rejects.toThrow(InvalidParameterError);
        });

        it('should throw "InvalidParameterError" when given an invalid "bookingId"', async () => {
            const page = 1;
            const limit = 10;
            const bookingId = 'INVALID_ID';

            await expect(() =>
                guestsService.getGuests(page, limit, bookingId),
            ).rejects.toThrow(InvalidParameterError);
        });
    });

    describe('getGuestById()', () => {
        it('should return the guest with matching "guestId"', async () => {
            const guestId = guestStub._id;

            const guest = await guestsService.getGuestById(guestId);

            expect(guest).toEqual(guestStub);
        });

        it('should throw "InvalidIdError" when given an invalid "guestId"', async () => {
            const guestId = 'INVALID_ID';

            await expect(() =>
                guestsService.getGuestById(guestId),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "GuestNotFoundError" when guestModel.findById() returns null', async () => {
            guestModel.findById.mockResolvedValueOnce(null);

            const guestId = guestStub._id;

            await expect(() =>
                guestsService.getGuestById(guestId),
            ).rejects.toThrow(GuestNotFoundError);
        });
    });

    describe('createGuest()', () => {
        it('should return the created guest', async () => {
            const guest = guestStub;

            const createdGuest = await guestsService.createGuest(guest);

            expect(createdGuest).toEqual(guestStub);
        });

        it('should throw "InvalidIdError" when given an invalid "bookingIds"', async () => {
            const guest = {
                ...guestStub,
                bookingIds: ['INVALID_ID'],
            };

            await expect(() =>
                guestsService.createGuest(guest),
            ).rejects.toThrow(InvalidIdError);
        });
    });

    describe('updateGuest()', () => {
        it('should return the updated guest', async () => {
            const guestId = guestStub._id;
            const guest = guestStub;

            const updatedGuest = await guestsService.updateGuest(
                guestId,
                guest,
            );

            expect(updatedGuest).toEqual(guestStub);
        });

        it('should throw "InvalidIdError" when given an invalid "guestId"', async () => {
            const guestId = 'INVALID_ID';
            const guest = guestStub;

            await expect(() =>
                guestsService.updateGuest(guestId, guest),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "InvalidIdError" when given an invalid "bookingIds"', async () => {
            const guestId = guestStub._id;
            const guest = {
                ...guestStub,
                bookingIds: ['INVALID_ID'],
            };

            await expect(() =>
                guestsService.updateGuest(guestId, guest),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "GuestNotFoundError" when guestModel.findById() returns null', async () => {
            guestModel.findById.mockResolvedValueOnce(null);

            const guestId = guestStub._id;
            const guest = guestStub;

            await expect(() =>
                guestsService.updateGuest(guestId, guest),
            ).rejects.toThrow(GuestNotFoundError);
        });
    });

    describe('deleteGuest()', () => {
        it('should return the deleted guest', async () => {
            const guestId = guestStub._id;

            const deletedGuest = await guestsService.deleteGuest(guestId);

            expect(deletedGuest).toEqual(guestStub);
        });

        it('should throw "InvalidIdError" when given an invalid "guestId"', async () => {
            const guestId = 'INVALID_ID';

            await expect(() =>
                guestsService.deleteGuest(guestId),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "GuestNotFoundError" when guestModel.findByIdAndDelete() returns null', async () => {
            guestModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const guestId = guestStub._id;

            await expect(() =>
                guestsService.deleteGuest(guestId),
            ).rejects.toThrow(GuestNotFoundError);
        });
    });
});
