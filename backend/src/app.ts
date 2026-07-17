import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(morgan('dev'));
app.use(express.json());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

app.get('/api/health', (_req, res) => res.status(200).json({ data: { status: 'ok' } }));

app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tasks', tasksRouter);

app.use(notFound);
app.use(errorHandler);
