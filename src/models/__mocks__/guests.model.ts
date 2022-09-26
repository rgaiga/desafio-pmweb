import guestStub from '../../__tests__/stubs/guests.stub';

export default {
	find: jest.fn().mockImplementation(() => ({
		limit: jest.fn().mockImplementation(() => ({
			skip: jest.fn().mockResolvedValue([guestStub]),
		})),
	})),
	findById: jest.fn().mockResolvedValue(guestStub),
	create: jest.fn().mockResolvedValue(guestStub),
	findByIdAndUpdate: jest.fn().mockResolvedValue(guestStub),
	findByIdAndRemove: jest.fn().mockResolvedValue(guestStub),
	estimatedDocumentCount: jest.fn().mockResolvedValue(1),
};
