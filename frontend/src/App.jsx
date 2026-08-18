import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { TaskListPage } from './pages/TaskListPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { KanbanPage } from './pages/KanbanPage';
import { ExternalUsers } from './components/ExternalUsers';

// App shell with navigation and routing
function App() {
  return (
    <BrowserRouter>
      <nav className='bg-gray-800 text-white p-4 flex gap-4'>
        <Link to='/' className='hover:underline'>Dashboard</Link>
        <Link to='/tasks' className='hover:underline'>Tasks</Link>
        <Link to='/kanban' className='text-white hover:underline'>Kanban</Link>
        <Link to='/team' className='text-white hover:underline'>Team</Link>

      </nav>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/tasks' element={<TaskListPage />} />
        <Route path='/tasks/:id' element={<TaskDetailPage />} />
        <Route path='/kanban' element={<KanbanPage />} />
        <Route path='/team' element={<ExternalUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;