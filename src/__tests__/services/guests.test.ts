// @ts-nocheck
import { InvalidId, InvalidParameter, GuestNotFound } from '../../classes/errors.class';
import guestStub from '../stubs/guests.stub';
import guestModel from '../../models/guests.model';
import guestsService from '../../services/guests.service';

jest.mock('../../models/guests.model');
jest.mock('../../models/bookings.model');

describe('Guests Service', () => {
	describe('getGuests(page, limit, bookingId?)', () => {
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

			const guests = await guestsService.getGuests(page, limit, bookingId);

			expect(guests).toEqual(expectedResponse);
		});

		it('should throw "InvalidParameter" when given an invalid "page"', async () => {
			const page = undefined;
			const limit = 10;
			const bookingId = guestStub.bookingIds[0];

			await expect(() => guestsService.getGuests(page, limit, bookingId)).rejects.toThrowError(
				InvalidParameter
			);
		});

		it('should throw "InvalidParameter" when given an invalid "limit"', async () => {
			const page = 1;
			const limit = undefined;
			const bookingId = guestStub.bookingIds[0];

			await expect(() => guestsService.getGuests(page, limit, bookingId)).rejects.toThrowError(
				InvalidParameter
			);
		});

		it('should throw "InvalidParameter" when given an invalid "bookingId"', async () => {
			const page = 1;
			const limit = 10;
			const bookingId = 'INVALID_ID';

			await expect(() => guestsService.getGuests(page, limit, bookingId)).rejects.toThrowError(
				InvalidParameter
			);
		});
	});

	describe('getGuestById(guestId)', () => {
		it('should return the guest with matching "guestId"', async () => {
			const guestId = guestStub._id;

			const guest = await guestsService.getGuestById(guestId);

			expect(guest).toEqual(guestStub);
		});

		it('should throw "InvalidId" when given an invalid "guestId"', async () => {
			const guestId = 'INVALID_ID';

			await expect(() => guestsService.getGuestById(guestId)).rejects.toThrowError(InvalidId);
		});

		it('should throw "GuestNotFound" when guestModel.findById() returns null', async () => {
			guestModel.findById.mockResolvedValueOnce(null);

			const guestId = guestStub._id;

			await expect(() => guestsService.getGuestById(guestId)).rejects.toThrowError(GuestNotFound);
		});
	});

	describe('createGuest(guest)', () => {
		it('should return the created guest', async () => {
			const guest = guestStub;

			const createdGuest = await guestsService.createGuest(guest);

			expect(createdGuest).toEqual(guestStub);
		});

		it('should throw "InvalidId" when given an invalid "bookingIds"', async () => {
			const guest = {
				...guestStub,
				bookingIds: ['INVALID_ID'],
			};

			await expect(() => guestsService.createGuest(guest)).rejects.toThrowError(InvalidId);
		});
	});

	describe('updateGuest(guestId, guest)', () => {
		it('should return the updated guest', async () => {
			const guestId = guestStub._id;
			const guest = guestStub;

			const updatedGuest = await guestsService.updateGuest(guestId, guest);

			expect(updatedGuest).toEqual(guestStub);
		});

		it('should throw "InvalidId" when given an invalid "guestId"', async () => {
			const guestId = 'INVALID_ID';
			const guest = guestStub;

			await expect(() => guestsService.updateGuest(guestId, guest)).rejects.toThrowError(InvalidId);
		});

		it('should throw "InvalidId" when given an invalid "bookingIds"', async () => {
			const guestId = guestStub._id;
			const guest = {
				...guestStub,
				bookingIds: ['INVALID_ID'],
			};

			await expect(() => guestsService.updateGuest(guestId, guest)).rejects.toThrowError(InvalidId);
		});

		it('should throw "GuestNotFound" when guestModel.findById() returns null', async () => {
			guestModel.findById.mockResolvedValueOnce(null);

			const guestId = guestStub._id;
			const guest = guestStub;

			await expect(() => guestsService.updateGuest(guestId, guest)).rejects.toThrowError(
				GuestNotFound
			);
		});
	});

	describe('deleteGuest(guestId)', () => {
		it('should return the deleted guest', async () => {
			const guestId = guestStub._id;

			const deletedGuest = await guestsService.deleteGuest(guestId);

			expect(deletedGuest).toEqual(guestStub);
		});

		it('should throw "InvalidId" when given an invalid "guestId"', async () => {
			const guestId = 'INVALID_ID';

			await expect(() => guestsService.deleteGuest(guestId)).rejects.toThrowError(InvalidId);
		});

		it('should throw "GuestNotFound" when guestModel.findByIdAndRemove() returns null', async () => {
			guestModel.findByIdAndRemove.mockResolvedValueOnce(null);

			const guestId = guestStub._id;

			await expect(() => guestsService.deleteGuest(guestId)).rejects.toThrowError(GuestNotFound);
		});
	});
});
