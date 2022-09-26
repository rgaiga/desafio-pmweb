import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app';

dotenv.config();

const DATABASE_PORT = process.env.DATABASE_PORT as string;
const SERVER_PORT = process.env.SERVER_PORT as string;

mongoose.connect(`mongodb://localhost:${DATABASE_PORT}/pmweb`, (error) => {
	if (error) throw error;

	console.log('Connected to database...');

	app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}...`));
});
