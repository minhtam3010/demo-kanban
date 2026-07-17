import { useEffect, useState } from 'react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { SortBy, SortOrder, TaskPriority, TaskStatus } from '../types';

interface TaskFiltersProps {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onChange: (next: {
    status?: TaskStatus | '';
    priority?: TaskPriority | '';
    search?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }) => void;
}

export function TaskFilters({ status, priority, search, sortBy, sortOrder, onChange }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) {
        onChange({ search: searchInput });
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-xs font-medium text-gray-500">Search title</label>
        <Input
          placeholder="Search by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Status</label>
        <Select value={status} onChange={(e) => onChange({ status: e.target.value as TaskStatus | '' })}>
          <option value="">All</option>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Priority</label>
        <Select value={priority} onChange={(e) => onChange({ priority: e.target.value as TaskPriority | '' })}>
          <option value="">All</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Sort by</label>
        <Select value={sortBy} onChange={(e) => onChange({ sortBy: e.target.value as SortBy })}>
          <option value="createdAt">Created</option>
          <option value="updatedAt">Updated</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
          <option value="priority">Priority</option>
        </Select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-500">Order</label>
        <Select value={sortOrder} onChange={(e) => onChange({ sortOrder: e.target.value as SortOrder })}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </Select>
      </div>
    </div>
  );
}
