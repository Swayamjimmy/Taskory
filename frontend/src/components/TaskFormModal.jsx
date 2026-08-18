import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Modal } from './Modal';

const emptyForm = { title: '', description: '', status: 'pending', priority: 'medium', assigned_to: '', due_date: '' };

function taskToForm(task) {
  if (!task) return emptyForm;
  return { ...task, description: task.description || '', assigned_to: task.assigned_to || '', due_date: task.due_date || '' };
}

export function TaskFormModal({ open, onClose, task, onSaved }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.getUsers().then(setUsers); }, []);

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <TaskForm key={task?.id ?? 'new'} task={task} users={users} onClose={onClose} onSaved={onSaved} />
    </Modal>
  );
}

function TaskForm({ task, users, onClose, onSaved }) {
  const [form, setForm] = useState(() => taskToForm(task));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...form, assigned_to: form.assigned_to ? parseInt(form.assigned_to, 10) : null, due_date: form.due_date || null };
    if (task) await api.updateTask(task.id, data);
    else await api.createTask(data);
    onSaved();
    onClose();
  };

  const inputClass = "border dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:text-white";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Title" className={inputClass} />
      <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" className={inputClass} />
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
      <select value={form.assigned_to} onChange={(e) => setForm((f) => ({ ...f, assigned_to: e.target.value }))} className={inputClass}>
        <option value="">Unassigned</option>
        {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
      </select>
      <input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} className={inputClass} />
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700">
        {task ? 'Save Changes' : 'Create Task'}
      </button>
    </form>
  );
}