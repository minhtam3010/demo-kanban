import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new ApiError(404, 'Not found'));
}
