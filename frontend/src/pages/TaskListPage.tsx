import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../features/tasks/hooks';
import { TaskFilters } from '../features/tasks/components/TaskFilters';
import { TaskTable } from '../features/tasks/components/TaskTable';
import { Pagination } from '../features/tasks/components/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { LinkButton } from '../components/ui/LinkButton';
import { getApiErrorMessage } from '../lib/apiClient';
import { SortBy, SortOrder, TaskPriority, TaskStatus } from '../features/tasks/types';

export function TaskListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const status = (searchParams.get('status') ?? '') as TaskStatus | '';
  const priority = (searchParams.get('priority') ?? '') as TaskPriority | '';
  const search = searchParams.get('search') ?? '';
  const sortBy = (searchParams.get('sortBy') ?? 'createdAt') as SortBy;
  const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as SortOrder;
  const limit = 10;

  const { data, isPending, isError, isFetching, error, refetch } = useTasks({
    page,
    limit,
    status: status || undefined,
    priority: priority || undefined,
    search: search || undefined,
    sortBy,
    sortOrder,
  });

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (!('page' in next)) {
      params.set('page', '1');
    }
    setSearchParams(params);
  }

  const hasActiveFilters = Boolean(status || priority || search);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <LinkButton to="/tasks/new">New Task</LinkButton>
      </div>

      <TaskFilters
        status={status}
        priority={priority}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onChange={(next) =>
          updateParams({
            status: next.status,
            priority: next.priority,
            search: next.search,
            sortBy: next.sortBy,
            sortOrder: next.sortOrder,
          })
        }
      />

      {isFetching && !isPending && <p className="text-xs text-gray-400">Updating...</p>}

      {isPending && <Spinner label="Loading tasks..." />}

      {isError && <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />}

      {!isPending && !isError && data && data.data.length === 0 && (
        <EmptyState
          title={hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting or clearing your filters.'
              : 'Create your first task to get started.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={() => setSearchParams({})}>
                Clear filters
              </Button>
            ) : (
              <LinkButton to="/tasks/new">Create a task</LinkButton>
            )
          }
        />
      )}

      {!isPending && !isError && data && data.data.length > 0 && (
        <>
          <TaskTable tasks={data.data} />
          <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />
        </>
      )}
    </div>
  );
}
