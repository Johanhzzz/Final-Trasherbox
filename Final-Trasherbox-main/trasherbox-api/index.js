const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Conexión a SQLite
const db = new sqlite3.Database("./trasherbox.db", (err) => {
  if (err) {
    console.error("Error conectando a SQLite:", err.message);
  } else {
    console.log("✅ Conectado a trasherbox.db");
  }
});

// ✅ Middleware actualizado para usar adminEmail
function verifyAdmin(req, res, next) {
  const email = req.body.adminEmail || req.query.adminEmail;
  if (!email) return res.status(400).json({ error: "Falta adminEmail" });

  db.get("SELECT rol FROM usuario WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(403).json({ error: "Acceso denegado" });
    if (row.rol !== "admin") return res.status(403).json({ error: "Solo administradores" });
    next();
  });
}

// Registro de usuario
app.post("/api/register", async (req, res) => {
  const { email, password, usuario, telefono } = req.body;
  if (!email || !password || !usuario || !telefono) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO usuario (email, password_hash, usuario, telefono) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, usuario, telefono],
      function (err) {
        if (err) {
          console.error("Error al registrar:", err.message);
          return res.status(400).json({ error: "Usuario ya existe o error al registrar" });
        }
        res.status(200).json({ success: true, userId: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM usuario WHERE email = ?`, [email], async (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });

    res.json({
      success: true,
      user: {
        id: row.id,
        email: row.email,
        usuario: row.usuario,
        rol: row.rol,
      },
    });
  });
});

// Ruta protegida de prueba
app.post("/api/admin/secure", verifyAdmin, (req, res) => {
  res.json({ message: "Ruta protegida para administradores" });
});

// Dashboard summary
app.get("/api/admin/dashboard-summary", (req, res) => {
  const summary = {};
  db.get("SELECT COUNT(*) AS totalUsuarios FROM usuario", (err, usuariosRow) => {
    if (err) return res.status(500).json({ error: "Error al contar usuarios" });
    summary.usuarios = usuariosRow.totalUsuarios;

    db.get("SELECT COUNT(*) AS totalPedidos FROM orden", (err, pedidosRow) => {
      if (err) return res.status(500).json({ error: "Error al contar pedidos" });
      summary.pedidos = pedidosRow.totalPedidos;

      db.get("SELECT COUNT(*) AS totalProductos FROM producto", (err, productosRow) => {
        if (err) return res.status(500).json({ error: "Error al contar productos" });
        summary.productos = productosRow.totalProductos;

        db.get("SELECT SUM(total) AS totalVentas FROM orden", (err, ventasRow) => {
          if (err) return res.status(500).json({ error: "Error al calcular ventas" });
          summary.ventas = ventasRow.totalVentas || 0;

          res.json(summary);
        });
      });
    });
  });
});

// Listar usuarios
app.post("/api/admin/users/list", verifyAdmin, (req, res) => {
  db.all("SELECT id, email, usuario, telefono, rol FROM usuario", (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al listar usuarios" });
    res.json(rows);
  });
});

// Crear usuario
app.post("/api/admin/users", verifyAdmin, async (req, res) => {
  const { email, password, usuario, telefono, rol } = req.body;
  if (!email || !password || !usuario || !telefono || !rol)
    return res.status(400).json({ error: "Faltan campos" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO usuario (email, password_hash, usuario, telefono, rol) VALUES (?, ?, ?, ?, ?)",
      [email, hashed, usuario, telefono, rol],
      function (err) {
        if (err) return res.status(400).json({ error: "Error al crear usuario" });
        res.json({ id: this.lastID });
      }
    );
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Actualizar usuario
app.put("/api/admin/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { email, usuario, telefono, rol } = req.body;
  db.run(
    "UPDATE usuario SET email=?, usuario=?, telefono=?, rol=? WHERE id=?",
    [email, usuario, telefono, rol, id],
    function (err) {
      if (err) return res.status(400).json({ error: "Error al actualizar" });
      res.json({ cambios: this.changes });
    }
  );
});

// Eliminar usuario
app.delete("/api/admin/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM usuario WHERE id=?", [id], function (err) {
    if (err) return res.status(400).json({ error: "Error al eliminar" });
    res.json({ eliminados: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API trasherbox corriendo en http://localhost:${PORT}`);
});
