import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Panel from "./pages/Panel";
import Productos from "./pages/Productos";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito"; // ajusta según tu estructura

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Panel />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
