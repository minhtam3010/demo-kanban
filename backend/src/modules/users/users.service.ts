import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/apiError';
import { ListUsersQuery, UpdateUserRoleInput } from './users.schema';

const publicSelect = { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true } as const;

export async function listUsers(query: ListUsersQuery) {
  const { page, limit } = query;

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      select: publicSelect,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
}

export async function getUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id }, select: publicSelect });
  if (!user) throw new ApiError(404, 'User not found');
  return user;
}

export async function updateUserRole(id: number, input: UpdateUserRoleInput) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new ApiError(404, 'User not found');

  if (target.role === 'ADMIN' && input.role === 'USER') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot demote the last remaining admin');
    }
  }

  return prisma.user.update({ where: { id }, data: { role: input.role }, select: publicSelect });
}

export async function deleteUser(id: number) {
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new ApiError(404, 'User not found');

  if (target.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount <= 1) {
      throw new ApiError(400, 'Cannot delete the last remaining admin');
    }
  }

  await prisma.user.delete({ where: { id } });
}
