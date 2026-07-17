import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTask, useDeleteTask } from '../features/tasks/hooks';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';
import { PriorityBadge } from '../features/tasks/components/PriorityBadge';
import { StatusChangeControl } from '../features/tasks/components/StatusChangeControl';
import { getApiErrorMessage } from '../lib/apiClient';
import { useState } from 'react';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();
  const deleteMutation = useDeleteTask();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: task, isPending, isError, error, refetch } = useTask(taskId);

  async function handleDelete() {
    if (!confirm('Delete this task? This cannot be undone.')) return;
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(taskId);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    }
  }

  if (isPending) return <Spinner label="Loading task..." />;
  if (isError) return <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />;
  if (!task) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/tasks" className="text-sm text-indigo-600 hover:underline">
          &larr; Back to tasks
        </Link>
        <div className="flex gap-2">
          <LinkButton to={`/tasks/${task.id}/edit`} variant="secondary">
            Edit
          </LinkButton>
          <Button variant="danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}

      <div className="rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
          <PriorityBadge priority={task.priority} />
        </div>
        {task.description && <p className="mt-4 whitespace-pre-wrap text-gray-600">{task.description}</p>}
        <div className="mt-6">
          <StatusChangeControl task={task} />
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Created {new Date(task.createdAt).toLocaleString()} · Updated {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
