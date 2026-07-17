import { Task, TaskStatus } from '@prisma/client';
import { ApiError } from '../../utils/apiError';

const STATUS_ORDER: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

export function assertCanAccessTask(user: { id: number; role: string }, task: Task | null): asserts task is Task {
  if (!task || (task.ownerId !== user.id && user.role !== 'ADMIN')) {
    throw new ApiError(404, 'Task not found');
  }
}

export function assertValidTransition(current: TaskStatus, next: TaskStatus): void {
  const from = STATUS_ORDER.indexOf(current);
  const to = STATUS_ORDER.indexOf(next);
  if (to !== from + 1) {
    throw new ApiError(400, `Cannot move task from ${current} to ${next}`);
  }
}
