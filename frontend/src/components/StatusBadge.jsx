const colors = { 
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300', 
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300', 
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300', 
  blocked: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' 
};

export function StatusBadge({ status }) {
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status] || ''}`}>{status}</span>;
}