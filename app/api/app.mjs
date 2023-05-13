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
import { emptyAssets } from './controllers/streamController.mjs';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import { importMovieMedia, updateMedia } from './dev-data/dev.mjs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/../.env.local` });

const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json());

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
if (process.env.NODE_ENV === 'production') app.use('/', emptyAssets);

app.use('/', viewRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/genre', genreRoutes);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/media', mediaRoutes);
app.use('/api/v1/stream', streamRoutes);
// app.use(express.static(join(__dirname, 'public')));

app.use(globalErrorHandler);
// schedule.scheduleJob(
//   '35 8,14,20 * * *',
//   catchAsync(async () => {
//     // eslint-disable-next-line
//     console.log('src update running');
//     const movies = await Media.find();
//     for (const movie of movies) {
//       const videoSrc = await getVideoUrl(movie.title_id, 1080);
//       if (!videoSrc) return;
//       await Movie.findOneAndUpdate(
//         { id: movie.id },
//         {
//           video_src: videoSrc,
//         }
//       );
//       // eslint-disable-next-line
//       console.log(movie.title, ' src updated');
//     }
//   })
// );
// updateMedia(103768);
export default app;
