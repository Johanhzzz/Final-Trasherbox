import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminApp from './admin/AdminApp';
import AdminRoute from './components/AdminRoute';

import Panel from './pages/Panel';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Carrito from './pages/Carrito';

function App() {
  return (
    <Routes>
      {/* Cliente */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Panel />} />
        <Route path="panel" element={<Panel />} />
        <Route path="productos" element={<Productos />} />
        <Route path="login" element={<Login />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminApp />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
