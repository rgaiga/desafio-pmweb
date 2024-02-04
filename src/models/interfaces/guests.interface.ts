import mongoose from 'mongoose';

export interface Guest {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    birthdate: string;
    phoneNumber: string;
    city: string;
    state: string;
    country: string;
    bookingIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
