import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.mjs';
import movieRoutes from './routes/movieRoutes.mjs';
import globalErrorHandler from './controllers/errorController.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { emptyAssets } from './controllers/movieController.mjs';

const app = express();

app.use(bodyParser.json());

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(
  cors({
    origin: '*',
  })
);
if (process.env.NODE_ENV === 'production') app.use('/', emptyAssets);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/movies', movieRoutes);
// app.use(express.static(join(__dirname, 'public')));

app.use(globalErrorHandler);
export default app;
