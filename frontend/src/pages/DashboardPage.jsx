import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  // Fetch dashboard stats from the API on first render
  useEffect(() => { api.getDashboard().then(setStats); }, []);
  
  if (!stats) return <p>Loading...</p>;
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <div className='grid grid-cols-3 gap-4'>
        <StatCard label='Total Tasks' value={stats.total_tasks} color='bg-white' />
        <StatCard label='Pending' value={stats.pending} color='bg-yellow-50' />
        <StatCard label='In Progress' value={stats.in_progress} color='bg-blue-50' />
        <StatCard label='Completed' value={stats.completed} color='bg-green-50' />
        <StatCard label='Blocked' value={stats.blocked} color='bg-red-50' />
        <StatCard label='Overdue' value={stats.overdue} color='bg-orange-50' />
      </div>
    </div>
  );
}