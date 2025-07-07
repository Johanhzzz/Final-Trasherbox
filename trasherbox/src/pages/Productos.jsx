import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../components/ProductCard.css";
import "./Productos.css";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({
    disponibilidad: [],
    precio: [],
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error al cargar productos:", err));
  }, []);

  const manejarCambioFiltro = (categoria, valor) => {
    setFiltros((prev) => {
      const yaExiste = prev[categoria].includes(valor);
      return {
        ...prev,
        [categoria]: yaExiste
          ? prev[categoria].filter((v) => v !== valor)
          : [...prev[categoria], valor],
      };
    });
  };

  const productosFiltrados = productos.filter((prod) => {
    // ✅ Filtrar por disponibilidad (usa estado: "disponible", "agotado")
    if (
      filtros.disponibilidad.length > 0 &&
      !filtros.disponibilidad.includes(prod.estado?.toLowerCase())
    ) {
      return false;
    }

    // ✅ Filtrar por precio
    if (filtros.precio.length > 0) {
      const cumplePrecio = filtros.precio.some((rango) => {
        if (rango === "<5000") return prod.precio < 5000;
        if (rango === "5000-10000")
          return prod.precio >= 5000 && prod.precio <= 10000;
        if (rango === ">10000") return prod.precio > 10000;
        return false;
      });
      if (!cumplePrecio) return false;
    }

    return true;
  });

  return (
    <div className="productos-container">
      <h1 className="productos-title">Nuestros Productos</h1>

      <div className="productos-layout">
        {/* Filtros laterales */}
        <aside className="productos-filtros">
          <h3>Filtros</h3>

          <div className="filtro-categoria">
            <strong>Disponibilidad</strong>
            <div>
              <input
                type="checkbox"
                onChange={() =>
                  manejarCambioFiltro("disponibilidad", "disponible")
                }
              />{" "}
              Disponibles
            </div>
            <div>
              <input
                type="checkbox"
                onChange={() =>
                  manejarCambioFiltro("disponibilidad", "agotado")
                }
              />{" "}
              Agotados
            </div>
          </div>

          <div className="filtro-categoria">
            <strong>Precio</strong>
            <div>
              <input
                type="checkbox"
                onChange={() => manejarCambioFiltro("precio", "<5000")}
              />{" "}
              Menor a $5.000
            </div>
            <div>
              <input
                type="checkbox"
                onChange={() => manejarCambioFiltro("precio", "5000-10000")}
              />{" "}
              $5.000 - $10.000
            </div>
            <div>
              <input
                type="checkbox"
                onChange={() => manejarCambioFiltro("precio", ">10000")}
              />{" "}
              Mayor a $10.000
            </div>
          </div>
        </aside>

        {/* Productos */}
        <div className="productos-grid">
          {productosFiltrados.map((prod) => (
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
