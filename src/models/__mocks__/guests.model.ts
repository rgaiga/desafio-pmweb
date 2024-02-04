// @ts-nocheck
import { guestStub } from '../../../__tests__/stubs/guests.stub';

export const guestModel = {
    find: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
            skip: jest.fn().mockResolvedValue([guestStub]),
        })),
    })),
    findById: jest.fn().mockResolvedValue(guestStub),
    create: jest.fn().mockResolvedValue(guestStub),
    findByIdAndUpdate: jest.fn().mockResolvedValue(guestStub),
    findByIdAndDelete: jest.fn().mockResolvedValue(guestStub),
    estimatedDocumentCount: jest.fn().mockResolvedValue(1),
};
