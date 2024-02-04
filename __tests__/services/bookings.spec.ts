// @ts-nocheck
import { bookingModel } from '@models';
import { bookingsService } from '@services';
import {
    InvalidIdError,
    InvalidParameterError,
    BookingNotFoundError,
} from '@errors';
import { bookingStub } from '../stubs/bookings.stub';

jest.mock('../../src/models/bookings.model');
jest.mock('../../src/models/guests.model');

describe('Bookings Service', () => {
    describe('getBookings()', () => {
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

            const bookings = await bookingsService.getBookings(
                page,
                limit,
                guestId,
            );

            expect(bookings).toEqual(expectedResponse);
        });

        it('should throw "InvalidParameterError" when given an invalid "page"', async () => {
            const page = undefined;
            const limit = 10;
            const guestId = bookingStub.guestIds[0];

            await expect(() =>
                bookingsService.getBookings(page, limit, guestId),
            ).rejects.toThrow(InvalidParameterError);
        });

        it('should throw "InvalidParameterError" when given an invalid "limit"', async () => {
            const page = 1;
            const limit = undefined;
            const guestId = bookingStub.guestIds[0];

            await expect(() =>
                bookingsService.getBookings(page, limit, guestId),
            ).rejects.toThrow(InvalidParameterError);
        });

        it('should throw "InvalidParameterError" when given an invalid "guestId"', async () => {
            const page = 1;
            const limit = 10;
            const guestId = 'INVALID_ID';

            await expect(() =>
                bookingsService.getBookings(page, limit, guestId),
            ).rejects.toThrow(InvalidParameterError);
        });
    });

    describe('getBookingById()', () => {
        it('should return the booking with matching "bookingId"', async () => {
            const bookingId = bookingStub._id;

            const booking = await bookingsService.getBookingById(bookingId);

            expect(booking).toEqual(bookingStub);
        });

        it('should throw "InvalidIdError" when given an invalid "bookingId"', async () => {
            const bookingId = 'INVALID_ID';

            await expect(() =>
                bookingsService.getBookingById(bookingId),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "BookingNotFoundError" when bookingModel.findById() returns null', async () => {
            bookingModel.findById.mockResolvedValueOnce(null);

            const bookingId = bookingStub._id;

            await expect(() =>
                bookingsService.getBookingById(bookingId),
            ).rejects.toThrow(BookingNotFoundError);
        });
    });

    describe('createBooking()', () => {
        it('should return the created booking', async () => {
            const booking = bookingStub;

            const createBooking = await bookingsService.createBooking(booking);

            expect(createBooking).toEqual(bookingStub);
        });

        it('should throw "InvalidIdError" when given an invalid "guestIds"', async () => {
            const booking = {
                ...bookingStub,
                guestIds: ['INVALID_ID'],
            };

            await expect(() =>
                bookingsService.createBooking(booking),
            ).rejects.toThrow(InvalidIdError);
        });
    });

    describe('updateBooking()', () => {
        it('should return the updated booking', async () => {
            const bookingId = bookingStub._id;
            const booking = bookingStub;

            const updatedGuest = await bookingsService.updateBooking(
                bookingId,
                booking,
            );

            expect(updatedGuest).toEqual(bookingStub);
        });

        it('should throw "InvalidIdError" when given an invalid "bookingId"', async () => {
            const bookingId = 'INVALID_ID';
            const booking = bookingStub;

            await expect(() =>
                bookingsService.updateBooking(bookingId, booking),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "InvalidIdError" when given an invalid "guestIds"', async () => {
            const bookingId = bookingStub._id;
            const booking = {
                ...bookingStub,
                guestIds: ['INVALID_ID'],
            };

            await expect(() =>
                bookingsService.updateBooking(bookingId, booking),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "BookingNotFoundError" when bookingModel.findById() returns null', async () => {
            bookingModel.findById.mockResolvedValueOnce(null);

            const bookingId = bookingStub._id;
            const booking = bookingStub;

            await expect(() =>
                bookingsService.updateBooking(bookingId, booking),
            ).rejects.toThrow(BookingNotFoundError);
        });
    });

    describe('deleteBooking()', () => {
        it('should return the deleted booking', async () => {
            const bookingId = bookingStub._id;

            const deletedBooking = await bookingsService.deleteBooking(
                bookingId,
            );

            expect(deletedBooking).toEqual(bookingStub);
        });

        it('should throw "InvalidIdError" when given an invalid "bookingId"', async () => {
            const bookingId = 'INVALID_ID';

            await expect(() =>
                bookingsService.deleteBooking(bookingId),
            ).rejects.toThrow(InvalidIdError);
        });

        it('should throw "BookingNotFoundError" when bookingModel.findByIdAndDelete() returns null', async () => {
            bookingModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const bookingId = bookingStub._id;

            await expect(() =>
                bookingsService.deleteBooking(bookingId),
            ).rejects.toThrow(BookingNotFoundError);
        });
    });
});
