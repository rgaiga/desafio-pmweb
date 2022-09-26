import { Types } from 'mongoose';
import { Pagination } from './pagination.interface';

export interface Guest {
	_id?: Types.ObjectId;
	name: string;
	email: string;
	birthdate: string;
	phoneNumber: string;
	city: string;
	state: string;
	country: string;
	bookingIds: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface GuestsWithPagination {
	pagination: Pagination;
	data: Guest[];
}
