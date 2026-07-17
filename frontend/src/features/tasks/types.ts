export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TaskListResponse {
  data: Task[];
  meta: TaskListMeta;
}

export type SortBy = 'title' | 'priority' | 'status' | 'createdAt' | 'updatedAt';
export type SortOrder = 'asc' | 'desc';

export interface TaskListParams {
  page: number;
  limit: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
}
