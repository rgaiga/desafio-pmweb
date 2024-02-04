export interface CreateGuestDTO {
    name: string;
    email: string;
    birthdate: string;
    phoneNumber: string;
    city: string;
    state: string;
    country: string;
    bookingIds: string[];
}

export interface UpdateGuestDTO {
    name?: string;
    email?: string;
    birthdate?: string;
    phoneNumber?: string;
    city?: string;
    state?: string;
    country?: string;
    bookingIds?: string[];
}
