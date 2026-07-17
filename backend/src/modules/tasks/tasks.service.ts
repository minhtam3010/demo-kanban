import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { ApiError } from '../../utils/apiError';
import { assertCanAccessTask, assertValidTransition } from './task.policy';
import { ChangeStatusInput, CreateTaskInput, ListTasksQuery, UpdateTaskInput } from './tasks.schema';

interface AuthUser {
  id: number;
  role: string;
}

export async function listTasks(user: AuthUser, query: ListTasksQuery) {
  const { page, limit, status, priority, search, sortBy, sortOrder, ownerId } = query;

  const where: Prisma.TaskWhereInput = {
    ...(user.role === 'ADMIN' ? (ownerId ? { ownerId } : {}) : { ownerId: user.id }),
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(search ? { title: { contains: search } } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data,
    meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getTask(user: AuthUser, id: number) {
  const task = await prisma.task.findUnique({ where: { id } });
  assertCanAccessTask(user, task);
  return task;
}

export async function createTask(user: AuthUser, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      priority: input.priority ?? 'MEDIUM',
      status: 'TODO',
      ownerId: user.id,
    },
  });
}

export async function updateTask(user: AuthUser, id: number, input: UpdateTaskInput) {
  const task = await prisma.task.findUnique({ where: { id } });
  assertCanAccessTask(user, task);

  return prisma.task.update({
    where: { id },
    data: input,
  });
}

export async function changeTaskStatus(user: AuthUser, id: number, input: ChangeStatusInput) {
  const task = await prisma.task.findUnique({ where: { id } });
  assertCanAccessTask(user, task);
  assertValidTransition(task.status, input.status);

  return prisma.task.update({
    where: { id },
    data: { status: input.status },
  });
}

export async function deleteTask(user: AuthUser, id: number) {
  const task = await prisma.task.findUnique({ where: { id } });
  assertCanAccessTask(user, task);
  await prisma.task.delete({ where: { id } });
}
