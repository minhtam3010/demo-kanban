import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { Button } from '../ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/tasks" className="text-lg font-semibold text-gray-900">
          Task Manager
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/tasks" className="text-gray-600 hover:text-gray-900">
            Tasks
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin/users" className="text-gray-600 hover:text-gray-900">
              Users
            </Link>
          )}
          <span className="text-gray-400">{user?.email}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        </nav>
      </div>
    </header>
  );
}
