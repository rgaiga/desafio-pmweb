import mongoose from 'mongoose';

export interface Booking {
    _id: mongoose.Types.ObjectId;
    hotelName: string;
    roomNumber: number;
    price: number;
    bookingDate: string;
    startDate: string;
    endDate: string;
    status: string;
    guestIds: string[];
    createdAt: Date;
    updatedAt: Date;
}
