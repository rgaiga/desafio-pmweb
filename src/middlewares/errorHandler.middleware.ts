/* eslint-disable  @typescript-eslint/no-unused-vars */
import { Error } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import {
    InvalidIdError,
    InvalidParameterError,
    GuestNotFoundError,
    BookingNotFoundError,
} from '@errors';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
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
        error instanceof InvalidIdError ||
        error instanceof InvalidParameterError ||
        error instanceof GuestNotFoundError ||
        error instanceof BookingNotFoundError
    ) {
        statusCode = error.statusCode;
        message = error.message;
        log = false;
    }

    if (error.message === 'TEST') log = false;

    if (log) console.error(error);

    res.status(statusCode).send({
        error: true,
        message,
    });
};
