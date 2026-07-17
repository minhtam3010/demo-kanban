import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <Link to="/tasks" className="mt-4 inline-block text-indigo-600 hover:underline">
        Go to tasks
      </Link>
    </div>
  );
}
