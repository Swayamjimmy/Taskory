import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => { api.getDashboard().then(setStats); }, []);
  
  if (!stats) return <p className="p-6 dark:text-gray-200">Loading...</p>;
  
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4 dark:text-white'>Dashboard</h1>
      <div className='grid grid-cols-3 gap-4'>
        <StatCard label='Total Tasks' value={stats.total_tasks} color='bg-white dark:bg-gray-800' />
        <StatCard label='Pending' value={stats.pending} color='bg-yellow-50 dark:bg-yellow-900/20' />
        <StatCard label='In Progress' value={stats.in_progress} color='bg-blue-50 dark:bg-blue-900/20' />
        <StatCard label='Completed' value={stats.completed} color='bg-green-50 dark:bg-green-900/20' />
        <StatCard label='Blocked' value={stats.blocked} color='bg-red-50 dark:bg-red-900/20' />
        <StatCard label='Overdue' value={stats.overdue} color='bg-orange-50 dark:bg-orange-900/20' />
      </div>
    </div>
  );
}