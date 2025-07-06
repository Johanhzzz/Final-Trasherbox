import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductListAdmin = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const loadProductos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/productos?all=1");
      if (!res.ok) throw new Error("Error al cargar productos");
      const data = await res.json();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error:", err);
      setProductos([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      await loadProductos();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProductos();
  }, []);

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  return (
    <div>
      <h2>Productos</h2>
      <button onClick={() => navigate("/admin/products/new")}>➕ Nuevo Producto</button>

      <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Título</th>
            <th style={cellStyle}>Precio</th>
            <th style={cellStyle}>Stock</th>
            <th style={cellStyle}>Estado</th>
            <th style={cellStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td style={cellStyle}>{p.id}</td>
              <td style={cellStyle}>{p.titulo}</td>
              <td style={cellStyle}>${p.precio}</td>
              <td style={cellStyle}>{p.stock}</td>
              <td style={cellStyle}>{p.estado}</td>
              <td style={cellStyle}>
                <button onClick={() => navigate(`/admin/products/${p.id}/edit`)}>✏️</button>
                <button onClick={() => handleDelete(p.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListAdmin;
