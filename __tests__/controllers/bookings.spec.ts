// @ts-nocheck
import request from 'supertest';
import { bookingModel } from '@models';
import { bookingStub } from '../stubs/bookings.stub';
import app from '../../src/app';

jest.mock('../../src/models/bookings.model');
jest.mock('../../src/models/guests.model');

const BASE_PATH = '/api/v1';

describe('Bookings Controller', () => {
    describe(`GET ${BASE_PATH}/bookings`, () => {
        it('should return all bookings and status code 200', async () => {
            const query = {
                page: '1',
                limit: '10',
            };

            const { status, body } = await request(app)
                .get(`${BASE_PATH}/bookings`)
                .query(query);

            expect(status).toBe(200);
            expect(body).toEqual({
                pagination: {
                    page: 1,
                    limit: 10,
                    count: 1,
                    totalPages: 1,
                    totalCount: 1,
                },
                data: [bookingStub],
            });
        });

        it('should return an error object and status code 500 when bookingsService.getBookings() throws', async () => {
            bookingModel.find.mockImplementationOnce(() => {
                throw new Error('TEST');
            });

            const { status, body } = await request(app).get(
                `${BASE_PATH}/bookings`,
            );

            expect(status).toBe(500);
            expect(body.error).toBe(true);
            expect(body.message).toBeDefined();
        });
    });

    describe(`GET ${BASE_PATH}/bookings/:bookingId`, () => {
        it('should return the booking with matching "bookingId" and status code 200', async () => {
            const bookingId = bookingStub._id;

            const { status, body } = await request(app).get(
                `${BASE_PATH}/bookings/${bookingId}`,
            );

            expect(status).toBe(200);
            expect(body).toEqual(bookingStub);
        });

        it('should return an error object and status code 400 when given an invalid "bookingId"', async () => {
            const bookingId = 'INVALID_ID';

            const { status, body } = await request(app).get(
                `${BASE_PATH}/bookings/${bookingId}`,
            );

            expect(status).toBe(400);
            expect(body.error).toBe(true);
            expect(body.message).toBeDefined();
        });
    });

    describe(`POST ${BASE_PATH}/bookings`, () => {
        it('should return the created booking and status code 201', async () => {
            const booking = bookingStub;

            const { status, body } = await request(app)
                .post(`${BASE_PATH}/bookings`)
                .send(booking);

            expect(status).toBe(201);
            expect(body).toEqual(bookingStub);
        });

        it('should return an error object and status code 500 when bookingsService.createBooking() throws', async () => {
            const booking = bookingStub;

            bookingModel.create.mockImplementationOnce(() => {
                throw new Error('TEST');
            });

            const { status, body } = await request(app)
                .post(`${BASE_PATH}/bookings`)
                .send(booking);

            expect(status).toBe(500);
            expect(body.error).toBe(true);
            expect(body.message).toBeDefined();
        });
    });

    describe(`PUT ${BASE_PATH}/bookings/:bookingId`, () => {
        it('should return the updated booking and status code 200', async () => {
            const bookingId = bookingStub._id;
            const booking = bookingStub;

            const { status, body } = await request(app)
                .put(`${BASE_PATH}/bookings/${bookingId}`)
                .send(booking);

            expect(status).toBe(200);
            expect(body).toEqual(bookingStub);
        });

        it('should return an error object and status code 400 when given an invalid "bookingId"', async () => {
            bookingModel.findByIdAndUpdate.mockResolvedValueOnce(null);

            const bookingId = 'INVALID_ID';
            const booking = bookingStub;

            const { status, body } = await request(app)
                .put(`${BASE_PATH}/bookings/${bookingId}`)
                .send(booking);

            expect(status).toBe(400);
            expect(body.error).toBe(true);
            expect(body.message).toBeDefined();
        });
    });

    describe(`DELETE ${BASE_PATH}/bookings/:bookingId`, () => {
        it('should return an empty object and status code 204', async () => {
            const bookingId = bookingStub._id;

            const { status, body } = await request(app).delete(
                `${BASE_PATH}/bookings/${bookingId}`,
            );

            expect(status).toBe(204);
            expect(body).toEqual({});
        });

        it('should return an error object and status code 400 when given an invalid "bookingId"', async () => {
            bookingModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const bookingId = 'INVALID_ID';

            const { status, body } = await request(app).delete(
                `${BASE_PATH}/bookings/${bookingId}`,
            );

            expect(status).toBe(400);
            expect(body.error).toBe(true);
            expect(body.message).toBeDefined();
        });
    });
});
