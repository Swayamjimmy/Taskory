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
    if (!commentText.trim()) return;
    await api.addComment(id, { comment: commentText, user_id: null });
    setCommentText('');
    loadComments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Task not found.</p>
        <button onClick={() => navigate('/tasks')} className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
          Return to Tasks
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/tasks')} 
        className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        ← Back to Tasks
      </button>

      {/* Main Task Card */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        
        {/* Card Header */}
        <div className="p-6 border-b dark:border-gray-700 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {task.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
              <span className="text-sm text-gray-500 dark:text-gray-400 border-l dark:border-gray-600 pl-3">
                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setEditOpen(true)} 
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium shadow-sm"
            >
              Edit Task
            </button>
            <button 
              onClick={() => setDeleteOpen(true)} 
              className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
        
        {/* Card Body - Description */}
        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 min-h-[120px]">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {task.description ? task.description : <span className="text-gray-400 dark:text-gray-500 italic">No description provided.</span>}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity & Comments</h2>
        
        <div className="space-y-6 mb-8">
          {comments.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No comments yet. Be the first to start the discussion!
              </p>
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0 text-blue-700 dark:text-blue-300 font-bold shadow-sm">
                  {(c.user_name || 'A')[0].toUpperCase()}
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                      {c.user_name || 'Anonymous'}
                    </span>
                    {c.created_at && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Form */}
        <form onSubmit={handleAddComment} className="flex items-start gap-4 pt-4 border-t dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400 font-bold shadow-sm">
            U
          </div>
          <div className="flex-1 flex gap-2">
            <input 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              placeholder="Add a comment..." 
              className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm" 
            />
            <button 
              type="submit" 
              disabled={!commentText.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      {/* Edit Modal */}
      <TaskFormModal open={editOpen} onClose={() => setEditOpen(false)} task={task} onSaved={loadTask} />
      
      {/* Delete Confirmation Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Task">
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{task.title}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setDeleteOpen(false)} 
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium shadow-sm"
          >
            Delete Task
          </button>
        </div>
      </Modal>
    </div>
  );
}