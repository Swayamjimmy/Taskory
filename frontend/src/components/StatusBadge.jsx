// Maps each task status to a colored badge
const colors = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', blocked: 'bg-red-100 text-red-800' };

export function StatusBadge({ status }) {
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || ''}`}>{status}</span>;
}