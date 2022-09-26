import mongoose from 'mongoose';
import { Guest } from '../interfaces/guests.interface';
import { dateValidator, phoneNumberValidator } from '../utils/validators';

const guestSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxLength: [64, 'O nome deve ter no máximo 64 caracteres.'],
			required: [true, 'O nome não deve ser nulo.'],
		},
		email: {
			type: String,
			maxLength: [64, 'O e-mail deve ter no máximo 64 caracteres.'],
			required: [true, 'O e-mail não deve ser nulo.'],
		},
		birthdate: {
			type: String,
			validate: {
				validator: dateValidator,
				message: 'A data de nascimento deve estar no formato YYYY-MM-DD.',
			},
			required: [true, 'A data de nascimento não deve ser nula.'],
		},
		phoneNumber: {
			type: String,
			validate: {
				validator: phoneNumberValidator,
				message: 'O número de telefone deve estar no formato E.164.',
			},
			required: [true, 'O número de telefone não deve ser nulo.'],
		},
		city: {
			type: String,
			maxLength: [64, 'A cidade deve ter no máximo 64 caracteres.'],
			required: [true, 'A cidade não deve ser nula.'],
		},
		state: {
			type: String,
			maxLength: [64, 'O estado deve ter no máximo 64 caracteres.'],
			required: [true, 'O estado não deve ser nulo.'],
		},
		country: {
			type: String,
			maxLength: [64, 'O país deve ter no máximo 64 caracteres.'],
			required: [true, 'O país não deve ser nulo.'],
		},
		bookingIds: [String],
	},
	{ timestamps: true, versionKey: false }
);

export default mongoose.model<Guest>('Guest', guestSchema);
