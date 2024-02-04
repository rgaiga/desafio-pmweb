import mongoose from 'mongoose';
import { isDateValid } from '@utils';
import { Booking } from '@models/interfaces';

const bookingSchema = new mongoose.Schema(
    {
        hotelName: {
            type: String,
            maxLength: [
                64,
                'O nome do hotel deve ter no máximo 64 caracteres.',
            ],
            required: [true, 'O nome do hotel não deve ser nulo.'],
        },
        roomNumber: {
            type: Number,
            min: [1, 'O número do quarto deve ser superior a 0.'],
            max: [999999, 'O número do quarto deve ser inferior a 1000000.'],
            required: [true, 'O número do quarto não deve ser nulo.'],
        },
        price: {
            type: Number,
            min: [0, 'O preço não deve ser negativo.'],
            max: [999999, 'Um milhão!!!???'],
            required: [true, 'O preço não deve ser nulo.'],
        },
        bookingDate: {
            type: String,
            validate: {
                validator: isDateValid,
                message: 'A data de reserva deve estar no formato YYYY-MM-DD.',
            },
            required: [true, 'A data de reserva não deve ser nula.'],
        },
        startDate: {
            type: String,
            validate: {
                validator: isDateValid,
                message: 'A data inicial deve estar no formato YYYY-MM-DD.',
            },
            required: [true, 'A data inicial não deve ser nula.'],
        },
        endDate: {
            type: String,
            validate: {
                validator: isDateValid,
                message: 'A data final deve estar no formato YYYY-MM-DD.',
            },
            required: [true, 'A data final não deve ser nula.'],
        },
        status: {
            type: String,
            enum: {
                values: ['CONFIRMED', 'CANCELED', 'CHECK_IN', 'CHECK_OUT'],
                message: 'O status é inválido.',
            },
            required: [true, 'O status não deve ser nulo.'],
        },
        guestIds: [String],
    },
    { timestamps: true, versionKey: false },
);

export const bookingModel = mongoose.model<Booking>('Booking', bookingSchema);
