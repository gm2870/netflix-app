import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes.mjs';
import mediaRoutes from './routes/mediaRoutes.mjs';
import authRoutes from './routes/authRoutes.mjs';
import globalErrorHandler from './controllers/errorController.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { emptyAssets } from './controllers/mediaController.mjs';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

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
// if you don't want to use cors package

// app.use(
//   '/api',
//   createProxyMiddleware({
//     target: 'http://localhost:3000',
//     changeOrigin: true,
//   })
// );
if (process.env.NODE_ENV === 'production') app.use('/', emptyAssets);

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/media', mediaRoutes);
// app.use(express.static(join(__dirname, 'public')));

app.use(globalErrorHandler);
export default app;
