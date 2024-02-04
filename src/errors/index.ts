export class GuestNotFoundError extends Error {
    guestId: string;
    statusCode: number;

    constructor(guestId: string) {
        super(`Não foi possível encontrar o hóspede com o ID "${guestId}".`);
        this.name = 'GuestNotFoundError';

        this.guestId = guestId;
        this.statusCode = 404;
    }
}

export class BookingNotFoundError extends Error {
    bookingId: string;
    statusCode: number;

    constructor(bookingId: string) {
        super(`Não foi possível encontrar a reserva com o ID "${bookingId}".`);
        this.name = 'BookingNotFoundError';

        this.bookingId = bookingId;
        this.statusCode = 404;
    }
}

export class InternalServerError extends Error {
    statusCode: number;

    constructor(message?: string) {
        super(message);
        this.name = 'InternalServerError';

        this.statusCode = 500;
    }
}

export class InvalidIdError extends Error {
    id: string;
    statusCode: number;

    constructor(id: string) {
        super(`O ID "${id}" é inválido.`);
        this.name = 'InvalidIdError';

        this.id = id;
        this.statusCode = 400;
    }
}

export class InvalidParameterError extends Error {
    parameter: string;
    statusCode: number;

    constructor(parameter: string) {
        super(`O parâmetro "${parameter}" é inválido.`);
        this.name = 'InvalidParameterError';

        this.parameter = parameter;
        this.statusCode = 400;
    }
}
