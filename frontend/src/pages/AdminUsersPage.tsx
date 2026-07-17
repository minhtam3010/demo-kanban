import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '../features/auth/usersApi';
import { useAuth } from '../features/auth/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { getApiErrorMessage } from '../lib/apiClient';
import { Role } from '../features/auth/types';

export function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['users', 1, 50],
    queryFn: () => usersApi.fetchUsers(1, 50),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: Role }) => usersApi.updateUserRole(id, role),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  async function handleRoleChange(id: number, role: Role) {
    setActionError(null);
    try {
      await roleMutation.mutateAsync({ id, role });
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this user? Their tasks will also be deleted.')) return;
    setActionError(null);
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    }
  }

  if (isPending) return <Spinner label="Loading users..." />;
  if (isError) return <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />;
  if (!data || data.data.length === 0) return <EmptyState title="No users found" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
      {actionError && <p className="text-sm text-red-600">{actionError}</p>}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Name</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {data.data.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.name ?? '—'}</td>
                <td className="px-4 py-2">
                  <Select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                    disabled={u.id === currentUser?.id}
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </td>
                <td className="px-4 py-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(u.id)}
                    disabled={u.id === currentUser?.id}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
