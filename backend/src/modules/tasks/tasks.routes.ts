import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import {
  changeStatusSchema,
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskSchema,
} from './tasks.schema';
import {
  changeTaskStatusHandler,
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from './tasks.controller';

export const tasksRouter = Router();

tasksRouter.use(authenticate);

tasksRouter.get('/', validate({ query: listTasksQuerySchema }), asyncHandler(listTasksHandler));
tasksRouter.post('/', validate({ body: createTaskSchema }), asyncHandler(createTaskHandler));
tasksRouter.get('/:id', validate({ params: taskIdParamsSchema }), asyncHandler(getTaskHandler));
tasksRouter.patch(
  '/:id',
  validate({ params: taskIdParamsSchema, body: updateTaskSchema }),
  asyncHandler(updateTaskHandler),
);
tasksRouter.patch(
  '/:id/status',
  validate({ params: taskIdParamsSchema, body: changeStatusSchema }),
  asyncHandler(changeTaskStatusHandler),
);
tasksRouter.delete('/:id', validate({ params: taskIdParamsSchema }), asyncHandler(deleteTaskHandler));
