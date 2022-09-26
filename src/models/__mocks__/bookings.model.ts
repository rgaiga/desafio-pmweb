import bookingStub from '../../__tests__/stubs/bookings.stub';

export default {
	find: jest.fn().mockImplementation(() => ({
		limit: jest.fn().mockImplementation(() => ({
			skip: jest.fn().mockResolvedValue([bookingStub]),
		})),
	})),
	findById: jest.fn().mockResolvedValue(bookingStub),
	create: jest.fn().mockResolvedValue(bookingStub),
	findByIdAndUpdate: jest.fn().mockResolvedValue(bookingStub),
	findByIdAndRemove: jest.fn().mockResolvedValue(bookingStub),
	estimatedDocumentCount: jest.fn().mockResolvedValue(1),
};
