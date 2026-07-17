import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '../features/tasks/components/TaskForm';
import { useCreateTask } from '../features/tasks/hooks';
import { getApiErrorMessage } from '../lib/apiClient';

export function TaskCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateTask();
  const [serverError, setServerError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">New Task</h1>
      <TaskForm
        submitLabel="Create Task"
        serverError={serverError}
        onSubmit={async (values) => {
          setServerError(null);
          try {
            const task = await createMutation.mutateAsync(values);
            navigate(`/tasks/${task.id}`, { replace: true });
          } catch (err) {
            setServerError(getApiErrorMessage(err));
          }
        }}
      />
    </div>
  );
}
