/* istanbul ignore file */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import guestsRoute from './routes/guests.route';
import bookingsRoute from './routes/bookings.route';
import errorHandler from './middlewares/errorHandler.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			upgradeInsecureRequests: null,
		},
	})
);

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const basePath = '/api/v1';

app.use(`${basePath}/guests`, guestsRoute);
app.use(`${basePath}/bookings`, bookingsRoute);
app.use(errorHandler);

export default app;
