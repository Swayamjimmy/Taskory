import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { Modal } from './Modal';

const emptyForm = { title: '', description: '', status: 'pending', priority: 'medium', assigned_to: '', due_date: '' };

function taskToForm(task) {
  if (!task) return emptyForm;
  return { ...task, description: task.description || '', assigned_to: task.assigned_to || '', due_date: task.due_date || '' };
}

export function TaskFormModal({ open, onClose, task, onSaved }) {
  const [users, setUsers] = useState([]);
  
  useEffect(() => { 
    api.getUsers().then(setUsers).catch(() => toast.error('Failed to load users')); 
  }, []);

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <TaskForm key={task?.id ?? 'new'} task={task} users={users} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}

function TaskForm({ task, users, onClose, onSaved }) {
  const [form, setForm] = useState(() => taskToForm(task));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = { 
      ...form, 
      assigned_to: form.assigned_to ? parseInt(form.assigned_to, 10) : null, 
      due_date: form.due_date || null 
    };
    
    try {
      if (task) {
        await api.updateTask(task.id, data);
        toast.success('Task updated successfully!');
      } else {
        await api.createTask(data);
        toast.success('New task created!');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Something went wrong.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Task Title" className={inputClass} />
      <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={4} className={inputClass} />
      
      <div className="grid grid-cols-2 gap-4">
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} className={inputClass}>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
        </select>
        
        <select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))} className={inputClass}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select value={form.assigned_to} onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))} className={inputClass}>
          <option value="">Unassigned</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        
        <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className={inputClass} />
      </div>

      <div className="flex justify-end gap-3 mt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md font-medium transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
          {isSubmitting ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}