import { Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Role } from '../features/auth/types';

export function RoleRoute({ roles }: { roles: Role[] }) {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return (
      <div className="mx-auto mt-16 max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">You don't have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
}
