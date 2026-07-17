import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.statusCode, details: err.details },
    });
  }

  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error', code: 500 } });
}
