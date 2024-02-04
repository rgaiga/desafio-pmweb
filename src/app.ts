import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import { guestsRouter, bookingsRouter } from '@routes';
import { errorHandler } from '@middlewares';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            upgradeInsecureRequests: null,
        },
    }),
);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const BASE_PATH = '/api/v1';

app.use(`${BASE_PATH}/guests`, guestsRouter);
app.use(`${BASE_PATH}/bookings`, bookingsRouter);
app.use(errorHandler);

export default app;
