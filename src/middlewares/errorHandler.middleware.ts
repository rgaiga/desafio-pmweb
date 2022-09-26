/* istanbul ignore file */
import { Error } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import {
	InvalidId,
	InvalidParameter,
	GuestNotFound,
	BookingNotFound,
	UnknownError,
} from '../classes/errors.class';

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
	let statusCode = 500;
	let message: string | string[] = 'Ocorreu um erro inesperado!';
	let log = true;

	if (error instanceof Error.ValidationError) {
		const errors = Object.entries(error.errors);
		const messages = [];

		for (const error of errors) messages.push(error[1].message);

		statusCode = 400;
		message = messages.length === 1 ? messages[0] : messages;
		log = false;
	}

	if (
		error instanceof InvalidId ||
		error instanceof InvalidParameter ||
		error instanceof GuestNotFound ||
		error instanceof BookingNotFound ||
		error instanceof UnknownError
	) {
		statusCode = error.statusCode;
		message = error.message;
		log = false;
	}

	res.status(statusCode).send({
		error: true,
		message: message,
	});

	if (log) console.error(error);
};

export default errorHandler;
