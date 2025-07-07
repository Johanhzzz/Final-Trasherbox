// src/admin/AdminApp.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';

import Dashboard from './pages/Dashboard';
import DashboardGrafico from './pages/DashboardGrafico';
import DashboardPedidos from './pages/DashboardPedidos';
import DashboardResumen from './pages/DashboardResumen';
import DashboardStock from './pages/DashboardStock';
import DashboardTopProductos from './pages/DashboardTopProductos';

import Users from './pages/Users';
import Orders from './pages/Orders';
import ProductListAdmin from './pages/ProductListAdmin';
import ProductForm from './pages/ProductForm';
import ContactRequests from './pages/ContactRequests';

const AdminApp = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dashboard-grafico" element={<DashboardGrafico />} />
          <Route path="dashboard-pedidos" element={<DashboardPedidos />} />
          <Route path="dashboard-resumen" element={<DashboardResumen />} />
          <Route path="dashboard-stock" element={<DashboardStock />} />
          <Route path="dashboard-top-productos" element={<DashboardTopProductos />} />

          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />

          <Route path="products" element={<ProductListAdmin />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />

          <Route path="contact" element={<ContactRequests />} />

          {/* Default admin route */}
          <Route index element={<Dashboard />} />
        </Routes>
      </main>
    </>
  );
};

export default AdminApp;
