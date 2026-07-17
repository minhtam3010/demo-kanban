import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tasksApi from './api';
import { CreateTaskInput, TaskListParams, TaskStatus, UpdateTaskInput } from './types';

export function useTasks(params: TaskListParams) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => tasksApi.fetchTasks(params),
    placeholderData: keepPreviousData,
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', 'detail', id],
    queryFn: () => tasksApi.fetchTask(id),
    enabled: Number.isFinite(id),
  });
}

function useInvalidateTasks() {
  const queryClient = useQueryClient();
  return (id?: number) => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
    }
  };
}

export function useCreateTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.createTask(input),
    onSettled: () => invalidate(),
  });
}

export function useUpdateTask(id: number) {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (input: UpdateTaskInput) => tasksApi.updateTask(id, input),
    onSettled: () => invalidate(id),
  });
}

export function useChangeTaskStatus(id: number) {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.changeTaskStatus(id, status),
    onSettled: () => invalidate(id),
  });
}

export function useDeleteTask() {
  const invalidate = useInvalidateTasks();
  return useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSettled: (_data, _err, id) => invalidate(id),
  });
}
