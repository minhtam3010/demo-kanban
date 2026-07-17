import { TaskPriority } from '../types';

const classes: Record<TaskPriority, string> = {
  LOW: 'bg-blue-50 text-blue-700',
  MEDIUM: 'bg-purple-50 text-purple-700',
  HIGH: 'bg-red-50 text-red-700',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${classes[priority]}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}
