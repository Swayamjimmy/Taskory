// Maps each task priority to a colored badge
const colors = { low: 'bg-gray-100 text-gray-700', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700', urgent: 'bg-purple-100 text-purple-700' };

export function PriorityBadge({ priority }) {
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority] || ''}`}>{priority}</span>;
}