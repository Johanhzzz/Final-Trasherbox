import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Admin.css";

function Admin() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const userData = JSON.parse(localStorage.getItem("user"));
  const email = userData?.email;

  // Cargar productos existentes desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(data);
  }, []);

  // Guardar productos cada vez que cambian
  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image) return alert("Completa todos los campos obligatorios.");

    const nuevoProducto = {
      id: Date.now(),
      ...form,
      price: parseInt(form.price),
    };

    setProductos([...productos, nuevoProducto]);

    setForm({
      title: "",
      description: "",
      price: "",
      image: "",
    });
  };

  const handleEdit = (producto) => {
    const nuevoTitulo = prompt("Nuevo título:", producto.title);
    if (!nuevoTitulo) return;
    const actualizados = productos.map((p) =>
      p.id === producto.id ? { ...p, title: nuevoTitulo } : p
    );
    setProductos(actualizados);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("¿Estás seguro que deseas eliminar el producto?");
    if (confirm) {
      const filtrados = productos.filter((p) => p.id !== id);
      setProductos(filtrados);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h2>Panel de Administración</h2>

        {email === "admin@trasherbox.cl" ? (
          <>
            <form className="admin-form" onSubmit={handleAdd}>
              <input
                type="text"
                name="title"
                placeholder="Nombre del producto"
                value={form.title}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Descripción"
                value={form.description}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                value={form.price}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="image"
                placeholder="URL de imagen"
                value={form.image}
                onChange={handleChange}
                required
              />
              <button type="submit">Agregar Producto</button>
            </form>
          </>
        ) : (
          <p style={{ marginTop: "2rem" }}>No tienes permisos para ver esta sección.</p>
        )}

        <div className="admin-product-list">
          <h3>Productos Agregados</h3>
          <ul>
            {productos.map((prod) => (
              <li key={prod.id} className="admin-product-item">
                <img src={prod.image} alt={prod.title} className="admin-product-thumb" />
                <div className="admin-product-info">
                  <strong>{prod.title}</strong> - ${prod.price}
                  {email === "admin@trasherbox.cl" && (
                    <div className="admin-product-actions">
                      <button onClick={() => handleEdit(prod)}>✏️ Editar</button>
                      <button onClick={() => handleDelete(prod.id)}>🗑️ Eliminar</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Admin;
