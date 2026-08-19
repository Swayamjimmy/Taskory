import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { PriorityBadge } from '../components/PriorityBadge';

const COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'blocked', label: 'Blocked' },
];

// Helper to format the status key into readable text for the toast (e.g., "in_progress" -> "in progress")
const formatStatus = (status) => status.replace('_', ' ');

export function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  const [dragOver, setDragOver] = useState(null);
  const draggedId = useRef(null);

  const loadTasks = () => api.getTasks({ limit: 100 }).then(data => setTasks(data.items));
  
  useEffect(() => { 
    loadTasks().catch(() => toast.error('Failed to load tasks')); 
  }, []);

  // --- Drag and Drop Handlers (Desktop) ---
  const handleDragStart = (taskId) => { draggedId.current = taskId; };
  const handleDragOver = (e, colKey) => { e.preventDefault(); setDragOver(colKey); };
  
  const handleDrop = async (colKey) => {
    if (draggedId.current) {
      try {
        await api.updateTask(draggedId.current, { status: colKey });
        draggedId.current = null;
        setDragOver(null);
        toast.success(`Task moved to ${formatStatus(colKey)}`);
        loadTasks();
      } catch (error) {
        toast.error('Failed to move task');
      }
    }
  };

  // mobile fallback 
  const handleMobileStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      toast.success(`Task moved to ${formatStatus(newStatus)}`);
      loadTasks();
    } catch (error) {
      toast.error('Failed to move task');
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
            className={`flex-1 min-w-[250px] bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-3 transition-colors ${dragOver === col.key ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-400' : ''}`}
          >
            <h2 className='font-semibold mb-3 dark:text-white'>{col.label}</h2>
            {tasks.filter(t => t.status === col.key).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                className='bg-white dark:bg-gray-700 border dark:border-gray-600 rounded shadow p-3 mb-2 cursor-grab active:opacity-50 text-gray-900 dark:text-white flex flex-col'
              >
                <p className='font-medium text-sm mb-2'>{task.title}</p>
                <div className='flex gap-1 mb-2'>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="mt-auto pt-2 border-t dark:border-gray-600 md:hidden">
                  <select 
                    value={task.status}
                    onChange={(e) => handleMobileStatusChange(task.id, e.target.value)}
                    className="w-full text-xs border border-gray-300 dark:border-gray-500 rounded bg-gray-50 dark:bg-gray-600 dark:text-white p-1.5 outline-none"
                  >
                    <option value="pending">Move to Pending</option>
                    <option value="in_progress">Move to In Progress</option>
                    <option value="completed">Move to Completed</option>
                    <option value="blocked">Move to Blocked</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}