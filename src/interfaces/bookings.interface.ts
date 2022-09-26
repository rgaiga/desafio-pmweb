import { Types } from 'mongoose';
import { Pagination } from './pagination.interface';

export interface Booking {
	_id?: Types.ObjectId;
	hotelName: string;
	roomNumber: number;
	price: number;
	bookingDate: string;
	startDate: string;
	endDate: string;
	status: string;
	guestIds: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface BookingsWithPagination {
	pagination: Pagination;
	data: Booking[];
}
