import { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    email: "",
    usuario: "",
    telefono: "",
    rol: "cliente",
    password: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const adminEmail = "admin3@trasherbox.cl"; // Simulación de sesión

  const loadUsers = () => {
    fetch("http://localhost:3001/api/admin/users/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminEmail }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        return res.json();
      })
      .then(setUsers)
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `http://localhost:3001/api/admin/users/${form.id}`
      : "http://localhost:3001/api/admin/users";

    const payload = {
      email: form.email,
      usuario: form.usuario,
      telefono: form.telefono,
      rol: form.rol,
      ...(form.password && { password: form.password }),
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, adminEmail }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        loadUsers();
        resetForm();
      })
      .catch((err) => console.error("Error al guardar usuario:", err));
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" });
    setIsEdit(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    fetch(`http://localhost:3001/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminEmail }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.json();
      })
      .then(() => loadUsers())
      .catch((err) => console.error("Error al eliminar usuario:", err));
  };

  const resetForm = () => {
    setForm({
      id: null,
      email: "",
      usuario: "",
      telefono: "",
      rol: "cliente",
      password: "",
    });
    setIsEdit(false);
  };

  const cellStyle = {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Gestión de Usuarios</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="usuario" placeholder="Usuario" value={form.usuario} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="cliente">cliente</option>
          <option value="admin">admin</option>
        </select>
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange}
          required={!isEdit}
        />
        <button type="submit">{isEdit ? "Actualizar" : "Crear"}</button>
        {isEdit && <button onClick={resetForm} type="button">Cancelar</button>}
      </form>

      <table style={{ borderCollapse: "collapse", width: "100%", background: "#fff", boxShadow: "0 0 10px #ccc" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th style={cellStyle}>ID</th>
            <th style={cellStyle}>Email</th>
            <th style={cellStyle}>Usuario</th>
            <th style={cellStyle}>Teléfono</th>
            <th style={cellStyle}>Rol</th>
            <th style={cellStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={cellStyle}>{u.id}</td>
              <td style={cellStyle}>{u.email}</td>
              <td style={cellStyle}>{u.usuario}</td>
              <td style={cellStyle}>{u.telefono}</td>
              <td style={cellStyle}>{u.rol}</td>
              <td style={cellStyle}>
                <button onClick={() => handleEdit(u)}>✏️</button>
                <button onClick={() => handleDelete(u.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
