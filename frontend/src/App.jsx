import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { KanbanPage } from './pages/KanbanPage';
import { ExternalUsers } from './components/ExternalUsers';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Extract Navbar to consume the theme hook safely inside the provider
function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className='bg-gray-800 dark:bg-gray-950 text-white p-4 flex justify-between items-center'>
      <div className='flex gap-4'>
        <Link to='/' className='hover:underline'>Dashboard</Link>
        <Link to='/tasks' className='hover:underline'>Tasks</Link>
        <Link to='/kanban' className='hover:underline'>Kanban</Link>
        <Link to='/team' className='hover:underline'>Team</Link>
      </div>
      <button 
        onClick={toggleTheme}
        className='p-2 bg-gray-700 dark:bg-gray-800 rounded hover:bg-gray-600 transition-colors'
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/tasks' element={<TaskListPage />} />
          <Route path='/tasks/:id' element={<TaskDetailPage />} />
          <Route path='/kanban' element={<KanbanPage />} />
          <Route path='/team' element={<ExternalUsers />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;