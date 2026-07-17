import { apiClient } from '../../lib/apiClient';
import { Role, User } from './types';

export interface UserListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  data: User[];
  meta: UserListMeta;
}

export async function fetchUsers(page: number, limit: number): Promise<UserListResponse> {
  const res = await apiClient.get('/users', { params: { page, limit } });
  return res.data;
}

export async function updateUserRole(id: number, role: Role): Promise<User> {
  const res = await apiClient.patch(`/users/${id}/role`, { role });
  return res.data.data;
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`);
}
