// @ts-nocheck
import { InvalidId, InvalidParameter, BookingNotFound } from '../../classes/errors.class';
import bookingStub from '../stubs/bookings.stub';
import bookingModel from '../../models/bookings.model';
import bookingsService from '../../services/bookings.service';

jest.mock('../../models/bookings.model');
jest.mock('../../models/guests.model');

describe('Bookings Service', () => {
	describe('getBookings(page, limit, guestId?)', () => {
		const expectedResponse = {
			pagination: {
				page: 1,
				limit: 10,
				count: 1,
				totalPages: 1,
				totalCount: 1,
			},
			data: [bookingStub],
		};

		it('should return all bookings', async () => {
			const page = 1;
			const limit = 10;

			const bookings = await bookingsService.getBookings(page, limit);

			expect(bookings).toEqual(expectedResponse);
		});

		it('should return all bookings with matching "guestId"', async () => {
			const page = 1;
			const limit = 10;
			const guestId = bookingStub.guestIds[0];

			const bookings = await bookingsService.getBookings(page, limit, guestId);

			expect(bookings).toEqual(expectedResponse);
		});

		it('should throw "InvalidParameter" when given an invalid "page"', async () => {
			const page = undefined;
			const limit = 10;
			const guestId = bookingStub.guestIds[0];

			await expect(() => bookingsService.getBookings(page, limit, guestId)).rejects.toThrowError(
				InvalidParameter
			);
		});

		it('should throw "InvalidParameter" when given an invalid "limit"', async () => {
			const page = 1;
			const limit = undefined;
			const guestId = bookingStub.guestIds[0];

			await expect(() => bookingsService.getBookings(page, limit, guestId)).rejects.toThrowError(
				InvalidParameter
			);
		});

		it('should throw "InvalidParameter" when given an invalid "guestId"', async () => {
			const page = 1;
			const limit = 10;
			const guestId = 'INVALID_ID';

			await expect(() => bookingsService.getBookings(page, limit, guestId)).rejects.toThrowError(
				InvalidParameter
			);
		});
	});

	describe('getBookingById(bookingId)', () => {
		it('should return the booking with matching "bookingId"', async () => {
			const bookingId = bookingStub._id;

			const booking = await bookingsService.getBookingById(bookingId);

			expect(booking).toEqual(bookingStub);
		});

		it('should throw "InvalidId" when given an invalid "bookingId"', async () => {
			const bookingId = 'INVALID_ID';

			await expect(() => bookingsService.getBookingById(bookingId)).rejects.toThrowError(InvalidId);
		});

		it('should throw "BookingNotFound" when bookingModel.findById() returns null', async () => {
			bookingModel.findById.mockResolvedValueOnce(null);

			const bookingId = bookingStub._id;

			await expect(() => bookingsService.getBookingById(bookingId)).rejects.toThrowError(
				BookingNotFound
			);
		});
	});

	describe('createBooking(booking)', () => {
		it('should return the created booking', async () => {
			const booking = bookingStub;

			const createBooking = await bookingsService.createBooking(booking);

			expect(createBooking).toEqual(bookingStub);
		});

		it('should throw "InvalidId" when given an invalid "guestIds"', async () => {
			const booking = {
				...bookingStub,
				guestIds: ['INVALID_ID'],
			};

			await expect(() => bookingsService.createBooking(booking)).rejects.toThrowError(InvalidId);
		});
	});

	describe('updateBooking(bookingId, booking)', () => {
		it('should return the updated booking', async () => {
			const bookingId = bookingStub._id;
			const booking = bookingStub;

			const updatedGuest = await bookingsService.updateBooking(bookingId, booking);

			expect(updatedGuest).toEqual(bookingStub);
		});

		it('should throw "InvalidId" when given an invalid "bookingId"', async () => {
			const bookingId = 'INVALID_ID';
			const booking = bookingStub;

			await expect(() => bookingsService.updateBooking(bookingId, booking)).rejects.toThrowError(
				InvalidId
			);
		});

		it('should throw "InvalidId" when given an invalid "guestIds"', async () => {
			const bookingId = bookingStub._id;
			const booking = {
				...bookingStub,
				guestIds: ['INVALID_ID'],
			};

			await expect(() => bookingsService.updateBooking(bookingId, booking)).rejects.toThrowError(
				InvalidId
			);
		});

		it('should throw "BookingNotFound" when bookingModel.findById() returns null', async () => {
			bookingModel.findById.mockResolvedValueOnce(null);

			const bookingId = bookingStub._id;
			const booking = bookingStub;

			await expect(() => bookingsService.updateBooking(bookingId, booking)).rejects.toThrowError(
				BookingNotFound
			);
		});
	});

	describe('deleteBooking(bookingId)', () => {
		it('should return the deleted booking', async () => {
			const bookingId = bookingStub._id;

			const deletedBooking = await bookingsService.deleteBooking(bookingId);

			expect(deletedBooking).toEqual(bookingStub);
		});

		it('should throw "InvalidId" when given an invalid "bookingId"', async () => {
			const bookingId = 'INVALID_ID';

			await expect(() => bookingsService.deleteBooking(bookingId)).rejects.toThrowError(InvalidId);
		});

		it('should throw "BookingNotFound" when bookingModel.findByIdAndRemove() returns null', async () => {
			bookingModel.findByIdAndRemove.mockResolvedValueOnce(null);

			const bookingId = bookingStub._id;

			await expect(() => bookingsService.deleteBooking(bookingId)).rejects.toThrowError(
				BookingNotFound
			);
		});
	});
});
