import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';



const AdminApp = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminApp;
