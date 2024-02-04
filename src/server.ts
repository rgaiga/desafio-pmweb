import 'module-alias/register';
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const DATABASE_URI = process.env.DATABASE_URI ?? '';
const SERVER_PORT = Number(process.env.SERVER_PORT ?? '');

mongoose.set('strictQuery', true);
mongoose
    .connect(DATABASE_URI, {
        serverSelectionTimeoutMS: 5000,
    })
    .then(() => {
        console.log('Connected to the database...');

        app.listen(SERVER_PORT, () => {
            console.log(`Listening on port ${SERVER_PORT}...`);
        });
    })
    .catch((error) => {
        throw error;
    });
