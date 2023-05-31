import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.mjs';
import streamRoutes from './routes/streamRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import viewRoutes from './routes/viewRoutes.mjs';
import genreRoutes from './routes/genreRoutes.mjs';
import mediaRoutes from './routes/mediaRoutes.mjs';
import globalErrorHandler from './controllers/errorController.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { forceSrcUpdate } from './dev-data/dev.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import schedule from 'node-schedule';
import catchAsync from './utils/catchAsync.mjs';
dotenv.config({ path: `${__dirname}/../.env` });

const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json());

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(
  cors({
    origin: '*',
  })
);
// if (process.env.NODE_ENV === 'production') app.use('/', emptyAssets);

app.use('/', viewRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/genre', genreRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/stream', streamRoutes);

app.use(globalErrorHandler);
const rule = new schedule.RecurrenceRule();
rule.hour = [4, 11, 19];
rule.minute = 30;
schedule.scheduleJob(
  rule,
  catchAsync(async () => {
    forceSrcUpdate('tv');
    forceSrcUpdate('movie');
  })
);
export default app;
