import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { loginSchema, registerSchema } from './auth.schema';
import { loginHandler, meHandler, registerHandler } from './auth.controller';

export const authRouter = Router();

authRouter.post('/register', validate({ body: registerSchema }), asyncHandler(registerHandler));
authRouter.post('/login', validate({ body: loginSchema }), asyncHandler(loginHandler));
authRouter.get('/me', authenticate, asyncHandler(meHandler));
