import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { listUsersQuerySchema, updateUserRoleSchema, userIdParamsSchema } from './users.schema';
import {
  deleteUserHandler,
  getUserHandler,
  listUsersHandler,
  updateUserRoleHandler,
} from './users.controller';

export const usersRouter = Router();

usersRouter.use(authenticate, authorize('ADMIN'));

usersRouter.get('/', validate({ query: listUsersQuerySchema }), asyncHandler(listUsersHandler));
usersRouter.get('/:id', validate({ params: userIdParamsSchema }), asyncHandler(getUserHandler));
usersRouter.patch(
  '/:id/role',
  validate({ params: userIdParamsSchema, body: updateUserRoleSchema }),
  asyncHandler(updateUserRoleHandler),
);
usersRouter.delete('/:id', validate({ params: userIdParamsSchema }), asyncHandler(deleteUserHandler));
