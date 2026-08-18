const colors = { 
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', 
  medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', 
  high: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', 
  urgent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
};

export function PriorityBadge({ priority }) {
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority] || ''}`}>{priority}</span>;
}