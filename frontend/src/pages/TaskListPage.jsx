import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Pagination } from '../components/Pagination';
import { TaskFormModal } from '../components/TaskFormModal';

export function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const navigate = useNavigate();

  const loadTasks = () => {
    setLoading(true);
    const params = { page, limit: 10 };
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (search) params.search = search;
    api.getTasks(params).then(data => { setTasks(data.items); setTotal(data.total); setPages(data.pages); }).finally(() => setLoading(false));
  };

  useEffect(() => { loadTasks(); }, [page, status, priority, search]);

      return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>Tasks</h1>
        <button onClick={() => setCreateOpen(true)} className='bg-blue-600 text-white px-4 py-2 rounded'>New Task</button>
      </div>
      <div className='flex gap-2 mb-4'>
        <select value={status} onChange={e => setStatus(e.target.value)} className='border rounded px-2 py-1'>
          <option value=''>All Statuses</option>
          <option value='pending'>Pending</option><option value='in_progress'>In Progress</option><option value='completed'>Completed</option><option value='blocked'>Blocked</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className='border rounded px-2 py-1'>
          <option value=''>All Priorities</option>
          <option value='low'>Low</option><option value='medium'>Medium</option><option value='high'>High</option><option value='urgent'>Urgent</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search tasks...' className='border rounded px-2 py-1' />
      </div>
      {loading ? <p>Loading...</p> : tasks.length === 0 ? <p className='text-gray-400'>No tasks match your filters.</p> : (
        <table className='w-full border-collapse'>
          <thead><tr className='bg-gray-100'><th className='p-2 text-left'>Title</th><th>Status</th><th>Priority</th><th>Due Date</th></tr></thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id} className='border-b cursor-pointer hover:bg-gray-50' onClick={() => navigate(`/tasks/${t.id}`)}>
                <td className='p-2'>{t.title}</td>
                <td className='p-2'><StatusBadge status={t.status} /></td>
                <td className='p-2'><PriorityBadge priority={t.priority} /></td>
                <td className='p-2'>{t.due_date || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <TaskFormModal open={createOpen} onClose={() => setCreateOpen(false)} task={null} onSaved={loadTasks} />
    </div>
  );
}