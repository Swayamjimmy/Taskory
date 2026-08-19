import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboard(), 
      api.getTasks({ limit: 5 })
    ])
      .then(([statsData, tasksData]) => {
        setStats(statsData);
        setRecentTasks(tasksData.items || []);
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="text-gray-400 dark:text-gray-500">Curating your workspace...</div>
        </div>
      </div>
    );
  }

  const safeStats = stats || { total_tasks: 0, pending: 0, in_progress: 0, completed: 0, blocked: 0 };
  const completionPercentage = safeStats.total_tasks > 0 
    ? Math.round((safeStats.completed / safeStats.total_tasks) * 100) 
    : 0;

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* 1. Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
            Welcome back 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {today}
          </p>
        </div>
        <Link 
          to="/tasks" 
          className="inline-flex items-center justify-center bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-700 dark:hover:bg-white transition-colors shadow-sm w-full md:w-auto"
        >
          Go to Tasks
          {/* Swapped the plus icon for a directional arrow */}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {/* 2. Visual Progress Bar */}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Project Progress</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{safeStats.completed} of {safeStats.total_tasks} tasks completed</p>
          </div>
          <span className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2.5 mt-4 overflow-hidden">
          <div 
            className="bg-emerald-500 dark:bg-emerald-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 3. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={safeStats.total_tasks} theme="indigo" />
        <StatCard title="In Progress" value={safeStats.in_progress} theme="amber" />
        <StatCard title="Pending" value={safeStats.pending} theme="sky" />
        <StatCard title="Blocked" value={safeStats.blocked} theme="rose" />
      </div>

      {/* 4. Recent Tasks Launchpad */}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Recent Tasks</h2>
          <Link to="/tasks" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {recentTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No tasks found. Time to create some!
            </div>
          ) : (
            recentTasks.map(task => (
              <div key={task.id} className="p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                <div className="flex-1 min-w-0">
                  <Link to={`/tasks/${task.id}`} className="block">
                    <p className="text-base font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </p>
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <Link 
                    to={`/tasks/${task.id}`}
                    className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    aria-label="View Task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
function StatCard({ title, value, theme }) {
  const themes = {
    indigo: 'bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-300 border-indigo-100/50 dark:border-indigo-800/30',
    amber: 'bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 border-amber-100/50 dark:border-amber-800/30',
    sky: 'bg-sky-50/50 dark:bg-sky-900/10 text-sky-700 dark:text-sky-300 border-sky-100/50 dark:border-sky-800/30',
    rose: 'bg-rose-50/50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-300 border-rose-100/50 dark:border-rose-800/30',
  };

  return (
    <div className={`p-6 rounded-xl border shadow-sm flex flex-col justify-center transition-colors ${themes[theme]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-80">{title}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}