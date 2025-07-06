import { useState, useEffect } from "react";
import "./ProductForm.css";

const ProductListAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    precio_anterior: "",
    descuento: "",
    imagen: "",
    estado: "disponible",
    resenas: 0,
    calificacion: 5,
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/productos");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      alert("Error cargando productos");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editandoId
      ? `http://localhost:3001/api/productos/${editandoId}`
      : "http://localhost:3001/api/productos";
    const method = editandoId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Error al guardar el producto");
      return;
    }

    await fetchProductos();
    setForm({
      titulo: "",
      descripcion: "",
      precio: "",
      precio_anterior: "",
      descuento: "",
      imagen: "",
      estado: "disponible",
      resenas: 0,
      calificacion: 5,
    });
    setEditandoId(null);
  };

  const handleEditar = (producto) => {
    setForm(producto);
    setEditandoId(producto.id);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    const res = await fetch(`http://localhost:3001/api/productos/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Error al eliminar producto");
      return;
    }

    await fetchProductos();
  };

  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>

      <form className="producto-form" onSubmit={handleSubmit}>
        <label>
          Título del producto
          <input name="titulo" placeholder="Ej: Caja Cartón Mediana" value={form.titulo} onChange={handleChange} required />
        </label>

        <label>
          Descripción (ej: medidas de la caja)
          <input name="descripcion" placeholder="Ej: 40x30x30 cm" value={form.descripcion} onChange={handleChange} />
        </label>

        <label>
          Precio actual
          <input name="precio" type="number" placeholder="Ej: 1890" value={form.precio} onChange={handleChange} required />
        </label>

        <label>
          Precio anterior (opcional)
          <input name="precio_anterior" type="number" placeholder="Ej: 2490" value={form.precio_anterior} onChange={handleChange} />
        </label>

        <label>
          Descuento en %
          <input name="descuento" type="number" placeholder="Ej: 24" value={form.descuento} onChange={handleChange} />
        </label>

        <label>
          Estado del producto
          <select name="estado" value={form.estado} onChange={handleChange}>
            <option value="disponible">Disponible</option>
            <option value="agotado">Agotado</option>
          </select>
        </label>

        <label>
          URL de imagen del producto
          <input name="imagen" placeholder="https://via.placeholder.com/300x200" value={form.imagen} onChange={handleChange} />
        </label>

        <label>
          Reseñas (cantidad)
          <input name="resenas" type="number" placeholder="Ej: 3" value={form.resenas} onChange={handleChange} />
        </label>

        <label>
          Calificación (de 1 a 5)
          <input name="calificacion" type="number" step="0.1" placeholder="Ej: 4.5" value={form.calificacion} onChange={handleChange} />
        </label>

        <button type="submit">{editandoId ? "Actualizar producto" : "Agregar producto"}</button>
      </form>

      <hr />

      <div className="lista-productos">
        {productos.map((p) => (
          <div key={p.id} className="producto-card-admin">
            <img
              src={p.imagen || "/fallback.jpg"}
              alt={p.titulo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback.jpg";
              }}
            />
            <h3>{p.titulo}</h3>
            <p>{p.descripcion}</p>
            <p>
              <b>${p.precio}</b>{" "}
              {p.precio_anterior && <span className="tachado">${p.precio_anterior}</span>}
            </p>
            <p>{p.descuento}% OFF</p>
            <p>{p.resenas} reseñas - {p.calificacion} ★</p>
            <p>{p.estado === "disponible" ? "🟢 Disponible" : "🔴 Agotado"}</p>
            <button onClick={() => handleEditar(p)}>✏️ Editar</button>
            <button onClick={() => handleEliminar(p.id)}>🗑️ Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListAdmin;
