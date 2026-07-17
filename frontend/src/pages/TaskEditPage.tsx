import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskForm } from '../features/tasks/components/TaskForm';
import { useTask, useUpdateTask } from '../features/tasks/hooks';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { getApiErrorMessage } from '../lib/apiClient';

export function TaskEditPage() {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();
  const { data: task, isPending, isError, error, refetch } = useTask(taskId);
  const updateMutation = useUpdateTask(taskId);
  const [serverError, setServerError] = useState<string | null>(null);

  if (isPending) return <Spinner label="Loading task..." />;
  if (isError) return <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />;
  if (!task) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Edit Task</h1>
      <TaskForm
        defaultValues={task}
        submitLabel="Save Changes"
        serverError={serverError}
        onSubmit={async (values) => {
          setServerError(null);
          try {
            await updateMutation.mutateAsync(values);
            navigate(`/tasks/${taskId}`, { replace: true });
          } catch (err) {
            setServerError(getApiErrorMessage(err));
          }
        }}
      />
    </div>
  );
}
