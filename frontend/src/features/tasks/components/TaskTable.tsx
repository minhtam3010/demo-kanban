import { Link } from 'react-router-dom';
import { Task } from '../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Title</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Status</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Priority</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">
                <Link to={`/tasks/${task.id}`} className="font-medium text-indigo-600 hover:underline">
                  {task.title}
                </Link>
              </td>
              <td className="px-4 py-2">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-2">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-2 text-gray-500">{new Date(task.updatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
