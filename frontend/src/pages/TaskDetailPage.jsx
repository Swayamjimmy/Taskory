import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Modal } from '../components/Modal';
import { TaskFormModal } from '../components/TaskFormModal';

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const loadTask = () => api.getTask(id).then(setTask);
  const loadComments = () => api.getComments(id).then(setComments);

  useEffect(() => {
    Promise.all([loadTask(), loadComments()]).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    await api.deleteTask(id);
    navigate('/tasks');
  };
    const handleAddComment = async (e) => {
    e.preventDefault();
    await api.addComment(id, { comment: commentText, user_id: null });
    setCommentText('');
    loadComments();
  };

  if (loading) return <p className='p-6'>Loading...</p>;
  if (!task) return <p className='p-6'>Task not found.</p>;
    return (
    <div className='p-6 max-w-2xl'>
      <button onClick={() => navigate('/tasks')} className='text-blue-600 mb-4'>← Back to Tasks</button>
      <h1 className='text-2xl font-bold mb-2'>{task.title}</h1>
      <div className='flex gap-2 mb-4'><StatusBadge status={task.status} /><PriorityBadge priority={task.priority} /></div>
      <p className='text-gray-600 mb-4'>{task.description}</p>
      <p className='text-sm text-gray-500 mb-1'>Due: {task.due_date || 'No due date'}</p>
      <div className='flex gap-2 mt-4 mb-6'>
        <button onClick={() => setEditOpen(true)} className='bg-blue-600 text-white px-4 py-2 rounded'>Edit</button>
        <button onClick={() => setDeleteOpen(true)} className='bg-red-600 text-white px-4 py-2 rounded'>Delete</button>
      </div>
      <h2 className='text-lg font-semibold mb-2'>Comments</h2>
      {comments.length === 0 && <p className='text-gray-400 mb-4'>No comments yet.</p>}
      {comments.map(c => <div key={c.id} className='border-b py-2'><p className='text-sm font-medium'>{c.user_name || 'Anonymous'}</p><p>{c.comment}</p></div>)}
      <form onSubmit={handleAddComment} className='mt-4 flex gap-2'>
        <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder='Add a comment...' className='border rounded px-2 py-1 flex-1' />
        <button type='submit' className='bg-blue-600 text-white px-4 py-1 rounded'>Post</button>
      </form>
      <TaskFormModal open={editOpen} onClose={() => setEditOpen(false)} task={task} onSaved={loadTask} />
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title='Delete Task'>
        <p className='mb-4'>Are you sure you want to delete this task?</p>
        <div className='flex gap-2'>
          <button onClick={handleDelete} className='bg-red-600 text-white px-4 py-2 rounded'>Delete</button>
          <button onClick={() => setDeleteOpen(false)} className='border px-4 py-2 rounded'>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}