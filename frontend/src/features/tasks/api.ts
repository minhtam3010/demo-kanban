import { apiClient } from '../../lib/apiClient';
import { CreateTaskInput, Task, TaskListParams, TaskListResponse, TaskStatus, UpdateTaskInput } from './types';

export async function fetchTasks(params: TaskListParams): Promise<TaskListResponse> {
  const res = await apiClient.get('/tasks', { params });
  return res.data;
}

export async function fetchTask(id: number): Promise<Task> {
  const res = await apiClient.get(`/tasks/${id}`);
  return res.data.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const res = await apiClient.post('/tasks', input);
  return res.data.data;
}

export async function updateTask(id: number, input: UpdateTaskInput): Promise<Task> {
  const res = await apiClient.patch(`/tasks/${id}`, input);
  return res.data.data;
}

export async function changeTaskStatus(id: number, status: TaskStatus): Promise<Task> {
  const res = await apiClient.patch(`/tasks/${id}/status`, { status });
  return res.data.data;
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
