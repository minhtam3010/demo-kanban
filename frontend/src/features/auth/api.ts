import { apiClient } from '../../lib/apiClient';
import { AuthResponse, LoginInput, RegisterInput, User } from './types';

export async function loginRequest(input: LoginInput): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/login', input);
  return res.data.data;
}

export async function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  const res = await apiClient.post('/auth/register', input);
  return res.data.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const res = await apiClient.get('/auth/me');
  return res.data.data;
}
