import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';

// App shell with navigation and routing
function App() {
  return (
    <BrowserRouter>
      <nav className='bg-gray-800 text-white p-4 flex gap-4'>
        <Link to='/' className='hover:underline'>Dashboard</Link>
        <Link to='/tasks' className='hover:underline'>Tasks</Link>
      </nav>
      <Routes>
        <Route path='/' element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;