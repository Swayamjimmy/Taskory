import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import { DashboardPage } from './pages/DashboardPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { KanbanPage } from './pages/KanbanPage';
import { ExternalUsers } from './components/ExternalUsers';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className='bg-gray-800 dark:bg-gray-950 text-white p-4 shadow-md'>
      <div className='flex flex-wrap justify-between items-center gap-4'>
        <div className='flex flex-wrap gap-4 text-sm font-medium'>
          <Link to='/' className='hover:text-blue-400 transition-colors'>Dashboard</Link>
          <Link to='/tasks' className='hover:text-blue-400 transition-colors'>Tasks</Link>
          <Link to='/kanban' className='hover:text-blue-400 transition-colors'>Kanban</Link>
          <Link to='/rick' className='hover:text-blue-400 transition-colors'>Multiverse</Link>
        </div>
        <button 
          onClick={toggleTheme}
          className='p-2 bg-gray-700 dark:bg-gray-800 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium ml-auto'
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#059669',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
            },
          }} 
        />
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/tasks' element={<TaskListPage />} />
          <Route path='/tasks/:id' element={<TaskDetailPage />} />
          <Route path='/kanban' element={<KanbanPage />} />
          <Route path='/rick' element={<ExternalUsers />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;