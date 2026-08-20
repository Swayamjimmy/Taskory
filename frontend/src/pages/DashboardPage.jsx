import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';

export function DashboardPage() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboard().then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="p-6">
        <p className="text-gray-500 dark:text-gray-400">
          Initializing workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">

        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            TASKORY CONTROL CENTER
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Your work, at a glance.
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl">
            Monitor your workload, identify bottlenecks, and jump directly
            into the work that needs your attention.
          </p>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => navigate('/tasks')}
          className="group inline-flex items-center justify-center gap-3
                     bg-gray-900 dark:bg-white
                     text-white dark:text-gray-900
                     px-5 py-3 rounded-xl
                     font-semibold shadow-lg
                     hover:scale-[1.02]
                     transition-all"
        >
          <span>Browse Task Queue</span>

          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </button>

      </div>


      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <StatCard
          label="Total Tasks"
          value={stats.total_tasks}
          color="bg-white dark:bg-gray-800"
        />

        <StatCard
          label="Pending"
          value={stats.pending}
          color="bg-yellow-50 dark:bg-yellow-900/20"
        />

        <StatCard
          label="In Progress"
          value={stats.in_progress}
          color="bg-blue-50 dark:bg-blue-900/20"
        />

        <StatCard
          label="Completed"
          value={stats.completed}
          color="bg-green-50 dark:bg-green-900/20"
        />

        <StatCard
          label="Blocked"
          value={stats.blocked}
          color="bg-red-50 dark:bg-red-900/20"
        />

        <StatCard
          label="Overdue"
          value={stats.overdue}
          color="bg-orange-50 dark:bg-orange-900/20"
        />

      </div>


      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Create Task */}
        <button
          onClick={() => navigate('/tasks?create=true')}
          className="text-left group
                     bg-blue-600 hover:bg-blue-700
                     text-white rounded-2xl p-6
                     transition-all hover:-translate-y-1
                     shadow-sm hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">

            <span className="w-11 h-11 rounded-xl bg-white/15
                             flex items-center justify-center text-xl">
              ＋
            </span>

            <span className="text-xl transition-transform group-hover:translate-x-1">
              
            </span>

          </div>

          <h2 className="text-lg font-bold">
            Deploy New Task
          </h2>

          <p className="text-sm text-blue-100 mt-2">
            Capture a new piece of work and add it to your workflow.
          </p>
        </button>


        {/* Kanban */}
        <button
          onClick={() => navigate('/kanban')}
          className="text-left group
                     bg-white dark:bg-gray-800
                     border dark:border-gray-700
                     rounded-2xl p-6
                     transition-all hover:-translate-y-1
                     hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">

            <span className="w-11 h-11 rounded-xl
                             bg-purple-100 dark:bg-purple-900/40
                             text-purple-600 dark:text-purple-300
                             flex items-center justify-center text-xl">
              ◫
            </span>

            <span className="text-xl text-gray-400
                             transition-transform group-hover:translate-x-1">
              →
            </span>

          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Open Workflow Board
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Move work across stages and manage progress visually.
          </p>
        </button>


        {/* Attention Required */}
        <button
          onClick={() => navigate('/tasks?status=blocked')}
          className="text-left group
                     bg-white dark:bg-gray-800
                     border dark:border-gray-700
                     rounded-2xl p-6
                     transition-all hover:-translate-y-1
                     hover:shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">

            <span className="w-11 h-11 rounded-xl
                             bg-red-100 dark:bg-red-900/40
                             text-red-600 dark:text-red-300
                             flex items-center justify-center text-xl">
              !
            </span>

            <span className="text-xl text-gray-400
                             transition-transform group-hover:translate-x-1">
              →
            </span>

          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Resolve Blockers
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Review work that is currently preventing progress.
          </p>
        </button>

      </div>

    </div>
  );
}