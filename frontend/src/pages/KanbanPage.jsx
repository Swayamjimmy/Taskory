import { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

// Define the four status columns for the board
const COLUMNS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'blocked', label: 'Blocked' },
];

export function KanbanPage() {
  const [tasks, setTasks] = useState([]);
  // Track which column is being dragged over
  const [dragOver, setDragOver] = useState(null);
  // Store the dragged task ID without triggering re-renders
  const draggedId = useRef(null);

  const loadTasks = () => api.getTasks({ limit: 100 }).then(data => setTasks(data.items));
  useEffect(() => { loadTasks(); }, []);

  // Drag handlers: start, hover, and drop
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
    // Render four columns with draggable task cards
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Kanban Board</h1>
      <div className='flex gap-4 overflow-x-auto'>
        {COLUMNS.map(col => (
          <div
            key={col.key}
            onDragOver={e => handleDragOver(e, col.key)}
            onDrop={() => handleDrop(col.key)}
            className={`flex-1 min-w-[220px] bg-gray-100 rounded-lg p-3 transition-colors ${dragOver === col.key ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
          >
            <h2 className='font-semibold mb-3'>{col.label}</h2>
            {tasks.filter(t => t.status === col.key).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                className='bg-white rounded shadow p-3 mb-2 cursor-grab active:opacity-50'
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