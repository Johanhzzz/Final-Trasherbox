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
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <input name="precio_anterior" type="number" placeholder="Precio anterior" value={form.precio_anterior} onChange={handleChange} />
        <input name="descuento" type="number" placeholder="Descuento (%)" value={form.descuento} onChange={handleChange} />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="disponible">Disponible</option>
          <option value="agotado">Agotado</option>
        </select>
        <input name="imagen" placeholder="URL de imagen" value={form.imagen} onChange={handleChange} />
        <input name="resenas" type="number" placeholder="Cantidad de reseñas" value={form.resenas} onChange={handleChange} />
        <input name="calificacion" type="number" step="0.1" placeholder="Calificación (1-5)" value={form.calificacion} onChange={handleChange} />
        <button type="submit">{editandoId ? "Actualizar" : "Agregar producto"}</button>
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
