import { z } from 'zod';

export const userIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER']),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
