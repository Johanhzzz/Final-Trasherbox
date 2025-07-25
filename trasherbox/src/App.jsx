import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminApp from './admin/AdminApp';
import AdminRoute from './components/AdminRoute';
import ConfirmarTransaccion from "./pages/ConfirmarTransaccion";
import Panel from './pages/Panel';
import Productos from './pages/Productos';
import Login from './pages/Login';
import Carrito from './pages/Carrito';
import Recuperar from "./pages/Recuperar";
import Resetear from "./pages/Resetear";


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
        <Route path="confirmar-transaccion" element={<ConfirmarTransaccion />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/resetear/:token" element={<Resetear />} />

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
