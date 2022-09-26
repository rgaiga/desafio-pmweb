/* istanbul ignore file */
export class InvalidId extends Error {
	id: string;
	statusCode: number;

	constructor(id: string) {
		if (id) {
			super(`O ID #${id} é inválido.`);
		} else {
			super('O ID não pode ser nulo.');
		}

		this.name = 'InvalidId';
		this.id = id;
		this.statusCode = 400;
	}
}

export class InvalidParameter extends Error {
	parameter: string;
	statusCode: number;

	constructor(parameter: string) {
		super(`O parâmetro "${parameter}" é inválido.`);

		this.name = 'InvalidParameter';
		this.parameter = parameter;
		this.statusCode = 400;
	}
}

export class GuestNotFound extends Error {
	guestId: string;
	statusCode: number;

	constructor(guestId: string) {
		super(`Não foi possível encontrar o hóspede com o ID #${guestId}.`);

		this.name = 'GuestNotFound';
		this.guestId = guestId;
		this.statusCode = 404;
	}
}

export class BookingNotFound extends Error {
	bookingId: string;
	statusCode: number;

	constructor(bookingId: string) {
		super(`Não foi possível encontrar a reserva com o ID #${bookingId}"`);

		this.name = 'BookingNotFound';
		this.bookingId = bookingId;
		this.statusCode = 404;
	}
}

export class UnknownError extends Error {
	statusCode: number;

	constructor() {
		super('Ocorreu um erro inesperado!');

		this.name = 'UnknownError';
		this.statusCode = 500;
	}
}
