import { useState, useEffect } from "react";
import "./ProductForm.css"; // Asegúrate de que este archivo exista

function ProductForm() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    precio: "",
    precioAnterior: "",
    descuento: "",
    estado: "disponible",
    imagen: "",
    resenas: 0,
    calificacion: 5,
  });

  const [editandoId, setEditandoId] = useState(null);

  // Cargar productos desde la API
  useEffect(() => {
    fetch("/api/productos")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editandoId ? "PUT" : "POST";
    const url = editandoId ? `/api/productos/${editandoId}` : "/api/productos";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      titulo: "",
      descripcion: "",
      precio: "",
      precioAnterior: "",
      descuento: "",
      estado: "disponible",
      imagen: "",
      resenas: 0,
      calificacion: 5,
    });
    setEditandoId(null);
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProductos(data);
  };

  const handleEditar = (producto) => {
    setForm(producto);
    setEditandoId(producto.id);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

    await fetch(`/api/productos/${id}`, { method: "DELETE" });
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProductos(data);
  };

  return (
    <div className="admin-productos-container">
      <h2>Gestión de Productos</h2>

      <form className="producto-form" onSubmit={handleSubmit}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <input name="precioAnterior" type="number" placeholder="Precio anterior" value={form.precioAnterior} onChange={handleChange} />
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
            <img src={p.imagen} alt={p.titulo} />
            <h3>{p.titulo}</h3>
            <p>{p.descripcion}</p>
            <p><b>${p.precio}</b> {p.precioAnterior && <span className="tachado">${p.precioAnterior}</span>}</p>
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
}

export default ProductForm;
