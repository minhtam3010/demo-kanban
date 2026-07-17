import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { useChangeTaskStatus } from '../hooks';
import { Task } from '../types';
import { getApiErrorMessage } from '../../../lib/apiClient';
import { StatusBadge } from './StatusBadge';

export function StatusChangeControl({ task }: { task: Task }) {
  const mutation = useChangeTaskStatus(task.id);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  async function transition(status: 'IN_PROGRESS' | 'DONE') {
    setError(null);
    try {
      await mutation.mutateAsync(status);
      setConfirming(false);
    } catch (err) {
      setError(getApiErrorMessage(err));
    }
  }

  if (task.status === 'DONE') {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status="DONE" />
        <span className="text-xs text-gray-400">Completed — no further changes allowed</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex items-center gap-2">
        <StatusBadge status={task.status} />
        {task.status === 'TODO' && (
          <Button onClick={() => transition('IN_PROGRESS')} disabled={mutation.isPending}>
            {mutation.isPending ? 'Starting...' : 'Start Progress'}
          </Button>
        )}
        {task.status === 'IN_PROGRESS' && !confirming && (
          <Button onClick={() => setConfirming(true)} disabled={mutation.isPending}>
            Mark Done
          </Button>
        )}
        {task.status === 'IN_PROGRESS' && confirming && (
          <>
            <span className="text-xs text-gray-500">Done is final. Confirm?</span>
            <Button onClick={() => transition('DONE')} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Confirm'}
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={mutation.isPending}>
              Cancel
            </Button>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
