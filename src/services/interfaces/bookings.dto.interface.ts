export interface CreateBookingDTO {
    hotelName: string;
    roomNumber: number;
    price: number;
    bookingDate: string;
    startDate: string;
    endDate: string;
    status: string;
    guestIds: string[];
}

export interface UpdateBookingDTO {
    hotelName?: string;
    roomNumber?: number;
    price?: number;
    bookingDate?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    guestIds?: string[];
}
