import { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

const COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'blocked', label: 'Blocked' },
];

export function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [dragOver, setDragOver] = useState(null);
  const draggedId = useRef(null);

  const loadTasks = () => api.getTasks({ limit: 100 }).then(data => setTasks(data.items));
  useEffect(() => { loadTasks(); }, []);

  const handleDragStart = (taskId) => { draggedId.current = taskId; };
  const handleDragOver = (e, colKey) => { e.preventDefault(); setDragOver(colKey); };
  const handleDrop = async (colKey) => {
    if (draggedId.current) {
      await api.updateTask(draggedId.current, { status: colKey });
      draggedId.current = null;
      setDragOver(null);
      loadTasks();
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4 dark:text-white'>Kanban Board</h1>
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {COLUMNS.map(col => (
          <div
            key={col.key}
            onDragOver={e => handleDragOver(e, col.key)}
            onDrop={() => handleDrop(col.key)}
            className={`flex-1 min-w-[220px] bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 transition-colors ${dragOver === col.key ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-400' : ''}`}
          >
            <h2 className='font-semibold mb-3 dark:text-white'>{col.label}</h2>
            {tasks.filter(t => t.status === col.key).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                className='bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow p-3 mb-2 cursor-grab active:opacity-50 text-gray-900 dark:text-white'
              >
                <p className='font-medium text-sm mb-1'>{task.title}</p>
                <div className='flex gap-1'><PriorityBadge priority={task.priority} /></div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}