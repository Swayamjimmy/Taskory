import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Pagination } from '../components/Pagination';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { TaskFormModal } from '../components/TaskFormModal';

export function TaskListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [createOpen, setCreateOpen] = useState(false);

  // ==========================================
  // Read filters, sorting and pagination
  // from the URL
  // ==========================================

  const page = Number(searchParams.get('page') || 1);
  const limit = 10;

  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const assignee = searchParams.get('assignee') || '';
  const search = searchParams.get('search') || '';

  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'desc';

  // ==========================================
  // Load users for assignee dropdown
  // ==========================================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };

    loadUsers();
  }, []);

  // ==========================================
  // Load tasks whenever URL parameters change
  // ==========================================

  useEffect(() => {
    loadTasks();
  }, [
    page,
    status,
    priority,
    assignee,
    search,
    sortBy,
    sortOrder,
  ]);

  // ==========================================
  // Fetch tasks
  // ==========================================

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (status) {
        params.status = status;
      }

      if (priority) {
        params.priority = priority;
      }

      if (assignee) {
        params.assignee = assignee;
      }

      if (search) {
        params.search = search;
      }

      const data = await api.getTasks(params);

      setTasks(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Search
  // ==========================================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchParams((params) => {
      if (value) {
        params.set('search', value);
      } else {
        params.delete('search');
      }

      params.set('page', '1');

      return params;
    });
  };

  // ==========================================
  // Status filter
  // ==========================================

  const handleStatusChange = (e) => {
    const value = e.target.value;

    setSearchParams((params) => {
      if (value) {
        params.set('status', value);
      } else {
        params.delete('status');
      }

      params.set('page', '1');

      return params;
    });
  };

  // ==========================================
  // Priority filter
  // ==========================================

  const handlePriorityChange = (e) => {
    const value = e.target.value;

    setSearchParams((params) => {
      if (value) {
        params.set('priority', value);
      } else {
        params.delete('priority');
      }

      params.set('page', '1');

      return params;
    });
  };

  // ==========================================
  // Assignee filter
  // ==========================================

  const handleAssigneeChange = (e) => {
    const value = e.target.value;

    setSearchParams((params) => {
      if (value) {
        params.set('assignee', value);
      } else {
        params.delete('assignee');
      }

      params.set('page', '1');

      return params;
    });
  };

  // ==========================================
  // Sorting
  // ==========================================

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(':');

    setSearchParams((params) => {
      params.set('sort_by', field);
      params.set('sort_order', order);
      params.set('page', '1');

      return params;
    });
  };

  // ==========================================
  // Pagination
  // ==========================================

  const handlePageChange = (newPage) => {
    setSearchParams((params) => {
      params.set('page', String(newPage));

      return params;
    });
  };

  // ==========================================
  // Clear filters
  // ==========================================

  const clearFilters = () => {
    setSearchParams({});
  };

  // ==========================================
  // After task is created/updated
  // ==========================================

  const handleSaved = () => {
    setCreateOpen(false);
    loadTasks();
  };

  // ==========================================
  // Determine whether filters are active
  // ==========================================

  const hasFilters =
    search ||
    status ||
    priority ||
    assignee ||
    sortBy !== 'created_at' ||
    sortOrder !== 'desc';

  // ==========================================
  // Render
  // ==========================================

  return (
    <div className="p-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and track team tasks
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          + New Task
        </button>

      </div>

      {/* ========================================
          FILTERS
      ======================================== */}

      <div className="bg-white border rounded-lg p-4 mb-6">

        <div className="flex flex-wrap gap-3">

          {/* Search */}

          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="border rounded px-3 py-2 min-w-[220px]"
          />

          {/* Status */}

          <select
            value={status}
            onChange={handleStatusChange}
            className="border rounded px-3 py-2"
          >
            <option value="">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="blocked">
              Blocked
            </option>
          </select>

          {/* Priority */}

          <select
            value={priority}
            onChange={handlePriorityChange}
            className="border rounded px-3 py-2"
          >
            <option value="">
              All Priorities
            </option>

            <option value="low">
              Low
            </option>

            <option value="medium">
              Medium
            </option>

            <option value="high">
              High
            </option>

            <option value="urgent">
              Urgent
            </option>
          </select>

          {/* Assignee */}

          <select
            value={assignee}
            onChange={handleAssigneeChange}
            className="border rounded px-3 py-2"
          >
            <option value="">
              All Assignees
            </option>

            {users.map((user) => (
              <option
                key={user.id}
                value={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          {/* Sorting */}

          <select
            value={`${sortBy}:${sortOrder}`}
            onChange={handleSortChange}
            className="border rounded px-3 py-2"
          >
            <option value="created_at:desc">
              Newest First
            </option>

            <option value="created_at:asc">
              Oldest First
            </option>

            <option value="title:asc">
              Title A-Z
            </option>

            <option value="title:desc">
              Title Z-A
            </option>

            <option value="due_date:asc">
              Due Date Earliest
            </option>

            <option value="due_date:desc">
              Due Date Latest
            </option>

            <option value="updated_at:desc">
              Recently Updated
            </option>

            <option value="updated_at:asc">
              Least Recently Updated
            </option>
          </select>

          {/* Clear */}

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="border rounded px-3 py-2 text-gray-600 hover:bg-gray-50"
            >
              Clear
            </button>
          )}

        </div>

      </div>

      {/* ========================================
          ERROR STATE
      ======================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">

          <div className="flex items-center justify-between">

            <span>
              {error}
            </span>

            <button
              onClick={loadTasks}
              className="font-medium underline"
            >
              Retry
            </button>

          </div>

        </div>
      )}

      {/* ========================================
          TASK TABLE
      ======================================== */}

      <div className="bg-white border rounded-lg overflow-hidden">

        {loading ? (

          /* Loading state */

          <div className="p-8 text-center text-gray-500">
            Loading tasks...
          </div>

        ) : tasks.length === 0 ? (

          /* Empty state */

          <div className="p-10 text-center">

            <h3 className="text-lg font-semibold text-gray-800">
              No tasks found
            </h3>

            <p className="text-gray-500 mt-1">
              Try changing your filters or create a new task.
            </p>

            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              Create Task
            </button>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-50 border-b">

              <tr>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Task
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Priority
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Assigned To
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Due Date
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Created
                </th>

                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Updated
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {tasks.map((task) => (

                <tr
                  key={task.id}
                  className="hover:bg-gray-50"
                >

                  {/* Task */}

                  <td className="px-4 py-4">

                    <Link
                      to={`/tasks/${task.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {task.title}
                    </Link>

                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}

                  </td>

                  {/* Status */}

                  <td className="px-4 py-4">
                    <StatusBadge status={task.status} />
                  </td>

                  {/* Priority */}

                  <td className="px-4 py-4">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Assignee */}

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {task.assignee_name ||
                      task.assigned_to ||
                      'Unassigned'}
                  </td>

                  {/* Due Date */}

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : '—'}
                  </td>

                  {/* Created Date */}

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {task.created_at
                      ? new Date(task.created_at).toLocaleDateString()
                      : '—'}
                  </td>

                  {/* Updated Date */}

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {task.updated_at
                      ? new Date(task.updated_at).toLocaleDateString()
                      : '—'}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* ========================================
          PAGINATION
      ======================================== */}

      {!loading && tasks.length > 0 && (

        <div className="mt-4 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing {tasks.length} of {total} tasks
          </p>

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
          />

        </div>

      )}

      {/* ========================================
          CREATE TASK MODAL
      ======================================== */}

      <TaskFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        task={null}
        onSaved={handleSaved}
      />

    </div>
  );
}