import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TaskListPage } from '../pages/TaskListPage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { TaskCreatePage } from '../pages/TaskCreatePage';
import { TaskEditPage } from '../pages/TaskEditPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/tasks" replace /> },
          { path: '/tasks', element: <TaskListPage /> },
          { path: '/tasks/new', element: <TaskCreatePage /> },
          { path: '/tasks/:id', element: <TaskDetailPage /> },
          { path: '/tasks/:id/edit', element: <TaskEditPage /> },
          {
            element: <RoleRoute roles={['ADMIN']} />,
            children: [{ path: '/admin/users', element: <AdminUsersPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
