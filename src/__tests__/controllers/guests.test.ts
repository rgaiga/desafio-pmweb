// @ts-nocheck
import request from 'supertest';
import guestStub from '../stubs/guests.stub';
import app from '../../app';
import guestModel from '../../models/guests.model';

jest.mock('../../models/guests.model');
jest.mock('../../models/bookings.model');

const basePath = '/api/v1';

describe('Guests Controller', () => {
	describe(`GET ${basePath}/guests`, () => {
		it('should return all guests and status code 200', async () => {
			const query = {
				page: '1',
				limit: '10',
			};

			const { status, body } = await request(app).get(`${basePath}/guests`).query(query);

			expect(status).toBe(200);
			expect(body).toEqual({
				pagination: {
					page: 1,
					limit: 10,
					count: 1,
					totalPages: 1,
					totalCount: 1,
				},
				data: [guestStub],
			});
		});

		it('should return an error object and status code 500 when guestsService.getGuests() throws', async () => {
			guestModel.find.mockImplementationOnce(() => ({
				limit: jest.fn().mockImplementationOnce(() => ({
					skip: jest.fn().mockResolvedValueOnce(null),
				})),
			}));

			const { status, body } = await request(app).get(`${basePath}/guests`);

			expect(status).toBe(500);
			expect(body.error).toBe(true);
			expect(body.message).toBeDefined();
		});
	});

	describe(`GET ${basePath}/guests/:guestId`, () => {
		it('should return the guest with matching "guestId" and status code 200', async () => {
			const guestId = guestStub._id;

			const { status, body } = await request(app).get(`${basePath}/guests/${guestId}`);

			expect(status).toBe(200);
			expect(body).toEqual(guestStub);
		});

		it('should return an error object and status code 400 when given an invalid "guestId"', async () => {
			const guestId = 'INVALID_ID';

			const { status, body } = await request(app).get(`${basePath}/guests/${guestId}`);

			expect(status).toBe(400);
			expect(body.error).toBe(true);
			expect(body.message).toBeDefined();
		});
	});

	describe(`POST ${basePath}/guests`, () => {
		it('should return the created guest and status code 201', async () => {
			const guest = guestStub;

			const { status, body } = await request(app).post(`${basePath}/guests`).send(guest);

			expect(status).toBe(201);
			expect(body).toEqual(guestStub);
		});

		it('should return an error object and status code 500 when guestsService.createGuest() throws', async () => {
			guestModel.create.mockResolvedValueOnce(null);

			const guest = guestStub;

			const { status, body } = await request(app).post(`${basePath}/guests`).send(guest);

			expect(status).toBe(500);
			expect(body.error).toBe(true);
			expect(body.message).toBeDefined();
		});
	});

	describe(`PUT ${basePath}/guests/:guestId`, () => {
		it('should return the updated guest and status code 200', async () => {
			const guestId = guestStub._id;
			const guest = guestStub;

			const { status, body } = await request(app).put(`${basePath}/guests/${guestId}`).send(guest);

			expect(status).toBe(200);
			expect(body).toEqual(guestStub);
		});

		it('should return an error object and status code 400 when given an invalid "guestId"', async () => {
			guestModel.findByIdAndUpdate.mockResolvedValueOnce(null);

			const guestId = 'INVALID_ID';
			const guest = guestStub;

			const { status, body } = await request(app).put(`${basePath}/guests/${guestId}`).send(guest);

			expect(status).toBe(400);
			expect(body.error).toBe(true);
			expect(body.message).toBeDefined();
		});
	});

	describe(`DELETE ${basePath}/guests/:guestId`, () => {
		it('should return an empty object and status code 204', async () => {
			const guestId = guestStub._id;

			const { status, body } = await request(app).delete(`${basePath}/guests/${guestId}`);

			expect(status).toBe(204);
			expect(body).toEqual({});
		});

		it('should return an error object and status code 400 when given an invalid "guestId"', async () => {
			guestModel.findByIdAndRemove.mockResolvedValueOnce(null);

			const guestId = 'INVALID_ID';

			const { status, body } = await request(app).delete(`${basePath}/guests/${guestId}`);

			expect(status).toBe(400);
			expect(body.error).toBe(true);
			expect(body.message).toBeDefined();
		});
	});
});
