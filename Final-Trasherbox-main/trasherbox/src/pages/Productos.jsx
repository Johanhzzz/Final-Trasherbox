import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  return (
    <div className="productos-container">
      <h1 className="productos-title">Nuestros Productos</h1>
      <div className="productos-grid">
        {productos.map((prod) => (
          <ProductCard
            key={prod.id}
            id={prod.id}
            title={prod.titulo}
            description={prod.descripcion}
            price={prod.precio}
            image={prod.imagen}
          />
        ))}
      </div>
    </div>
  );
}

export default Productos;
