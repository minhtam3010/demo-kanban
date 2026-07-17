import { z } from 'zod';

const statusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
const priorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be 200 characters or fewer'),
  description: z.string().trim().max(5000).optional(),
  priority: priorityEnum.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  priority: priorityEnum.optional(),
});

export const changeStatusSchema = z.object({
  status: statusEnum,
});

export const taskIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listTasksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
  search: z.string().trim().max(200).optional(),
  sortBy: z.enum(['title', 'priority', 'status', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  ownerId: z.coerce.number().int().positive().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
