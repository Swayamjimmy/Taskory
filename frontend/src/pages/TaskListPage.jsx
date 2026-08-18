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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const rawPage = searchParams.get('page');
  const parsedPage = rawPage ? Number(rawPage) : 1;
  const pageIsInvalid = !Number.isInteger(parsedPage) || parsedPage < 1;
  const page = pageIsInvalid ? 1 : parsedPage;
  const limit = 10;
  
  const status = searchParams.get('status') || '';
  const priority = searchParams.get('priority') || '';
  const assignee = searchParams.get('assignee') || '';
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort_by') || 'created_at';
  const sortOrder = searchParams.get('sort_order') || 'desc';

  useEffect(() => {
    api.getUsers().then(data => {
      setUsers(Array.isArray(data) ? data : data.items || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (!pageIsInvalid) return;
    setLoading(true);
    setSearchParams((params) => { params.set('page', '1'); return params; });
  }, [pageIsInvalid, setSearchParams]);

  useEffect(() => {
    if (pageIsInvalid) return;
    loadTasks();
  }, [page, status, priority, assignee, search, sortBy, sortOrder, pageIsInvalid]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit, sort_by: sortBy, sort_order: sortOrder };
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (assignee) params.assignee = assignee;
      if (search) params.search = search;

      const data = await api.getTasks(params);
      const items = data.items || [];
      const totalCount = Number(data.total || 0);
      const totalPages = Number(data.pages) || Math.ceil(totalCount / limit);

      if (totalPages > 0 && page > totalPages) {
        setSearchParams((p) => { p.set('page', String(totalPages)); return p; });
        return;
      }
      setTasks(items);
      setTotal(totalCount);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (key, value) => {
    setSearchParams(params => {
      if (value) params.set(key, value);
      else params.delete(key);
      params.set('page', '1');
      return params;
    });
  };

  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(':');
    setSearchParams(params => {
      params.set('sort_by', field);
      params.set('sort_order', order);
      params.set('page', '1');
      return params;
    });
  };

  const handleSaved = () => {
    setCreateOpen(false);
    loadTasks();
  };

  const hasFilters = search || status || priority || assignee || sortBy !== 'created_at' || sortOrder !== 'desc';
  const inputClass = "border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-3 py-2";

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track team tasks</p>
        </div>
        <button onClick={() => setCreateOpen(true)} className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
          + New Task
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input type="text" value={search} onChange={e => updateParam('search', e.target.value)} placeholder="Search tasks..." className={`${inputClass} min-w-[220px]`} />
          <select value={status} onChange={e => updateParam('status', e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>
          <select value={priority} onChange={e => updateParam('priority', e.target.value)} className={inputClass}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <select value={assignee} onChange={e => updateParam('assignee', e.target.value)} className={inputClass}>
            <option value="">All Assignees</option>
            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
          <select value={`${sortBy}:${sortOrder}`} onChange={handleSortChange} className={inputClass}>
            <option value="created_at:desc">Newest First</option>
            <option value="created_at:asc">Oldest First</option>
            <option value="title:asc">Title A-Z</option>
            <option value="title:desc">Title Z-A</option>
            <option value="due_date:asc">Due Date Earliest</option>
            <option value="due_date:desc">Due Date Latest</option>
            <option value="updated_at:desc">Recently Updated</option>
            <option value="updated_at:asc">Least Recently Updated</option>
          </select>
          {hasFilters && (
            <button onClick={() => setSearchParams({})} className="border dark:border-gray-600 rounded px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-4 mb-6 flex justify-between">
          <span>{error}</span>
          <button onClick={loadTasks} className="font-medium underline">Retry</button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading tasks...</div>
        ) : total === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{hasFilters ? 'Try changing your filters.' : 'Create your first task to get started.'}</p>
            <button onClick={() => setCreateOpen(true)} className="mt-4 bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">Create Task</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b dark:border-gray-700">
                <tr>
                  {['Task', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Created', 'Updated'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-4">
                      <Link to={`/tasks/${task.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">{task.title}</Link>
                      {task.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{task.description}</p>}
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-4"><PriorityBadge priority={task.priority} /></td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{task.assignee_name || task.assigned_to || 'Unassigned'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{task.created_at ? new Date(task.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">{task.updated_at ? new Date(task.updated_at).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing {tasks.length} of {total} tasks</p>
          <Pagination page={page} total={total} limit={limit} onPageChange={page => setSearchParams(p => { p.set('page', String(page)); return p; })} />
        </div>
      )}

      <TaskFormModal open={createOpen} onClose={() => setCreateOpen(false)} task={null} onSaved={handleSaved} />
    </div>
  );
}