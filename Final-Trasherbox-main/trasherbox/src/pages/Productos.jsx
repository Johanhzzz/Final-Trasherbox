import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../components/ProductCard.css";
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

      <div className="productos-layout">
        {/* Filtros laterales */}
        <aside className="productos-filtros">
          <h3>Filtros</h3>
          <div className="filtro-categoria">
            <strong>Disponibilidad</strong>
            <div><input type="checkbox" /> Disponibles</div>
            <div><input type="checkbox" /> Agotados</div>
          </div>

          <div className="filtro-categoria">
            <strong>Precio</strong>
            <div><input type="checkbox" /> Menor a $5.000</div>
            <div><input type="checkbox" /> $5.000 - $10.000</div>
            <div><input type="checkbox" /> Mayor a $10.000</div>
          </div>

          <div className="filtro-categoria">
            <strong>Tamaño de Caja</strong>
            <div><input type="checkbox" /> Pequeña</div>
            <div><input type="checkbox" /> Mediana</div>
            <div><input type="checkbox" /> Grande</div>
          </div>
        </aside>

        {/* Productos */}
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
    </div>
  );
}

export default Productos;
