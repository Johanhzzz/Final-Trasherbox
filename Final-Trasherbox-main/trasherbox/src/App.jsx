import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Panel from './pages/Panel';
import Productos from './pages/Productos';
import Login from './pages/Login';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Panel />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}

export default App;
