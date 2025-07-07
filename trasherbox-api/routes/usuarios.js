const express = require("express");
const db = require("../db/connection");
const router = express.Router();

// Middleware para verificar si es admin
function verifyAdmin(req, res, next) {
  const email = req.body.adminEmail || req.query.adminEmail;
  if (!email) return res.status(400).json({ error: "Falta adminEmail" });

  db.get("SELECT rol FROM usuario WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(403).json({ error: "Acceso denegado" });
    if (row.rol !== "admin") return res.status(403).json({ error: "Solo administradores" });
    next();
  });
}

// Ruta protegida de prueba
router.post("/admin/secure", verifyAdmin, (req, res) => {
  res.json({ message: "Ruta protegida para administradores" });
});

// Dashboard resumen
router.get("/admin/dashboard-summary", (req, res) => {
  const summary = {};
  db.get("SELECT COUNT(*) AS totalUsuarios FROM usuario", (err, usuariosRow) => {
    if (err) return res.status(500).json({ error: "Error al contar usuarios" });
    summary.usuarios = usuariosRow.totalUsuarios;

    db.get("SELECT COUNT(*) AS totalPedidos FROM orden", (err, pedidosRow) => {
      if (err) return res.status(500).json({ error: "Error al contar pedidos" });
      summary.ordenes = pedidosRow.totalPedidos;

      db.get("SELECT COUNT(*) AS totalProductos FROM producto", (err, productosRow) => {
        if (err) return res.status(500).json({ error: "Error al contar productos" });
        summary.productos = productosRow.totalProductos;

        db.get("SELECT SUM(monto) AS totalVentas FROM orden", (err, ventasRow) => {
          if (err) return res.status(500).json({ error: "Error al calcular ventas" });
          summary.ventas = ventasRow.totalVentas || 0;
          res.json(summary);
        });
      });
    });
  });
});

// Productos por categoría
router.get("/admin/productos-por-categoria", (req, res) => {
  db.all(
    `SELECT categoria, COUNT(*) as total 
     FROM producto 
     WHERE categoria IS NOT NULL AND categoria != '' 
     GROUP BY categoria`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Error al contar por categoría" });
      res.json(rows);
    }
  );
});

// Listar usuarios
router.post("/admin/users/list", verifyAdmin, (req, res) => {
  db.all("SELECT id, email, usuario, telefono, rol FROM usuario", (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al listar usuarios" });
    res.json(rows);
  });
});

// Crear usuario
router.post("/admin/users", verifyAdmin, async (req, res) => {
  const { email, password, usuario, telefono, rol } = req.body;
  const bcrypt = require("bcryptjs");

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
router.put("/admin/users/:id", verifyAdmin, (req, res) => {
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
router.delete("/admin/users/:id", verifyAdmin, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM usuario WHERE id=?", [id], function (err) {
    if (err) return res.status(400).json({ error: "Error al eliminar" });
    res.json({ eliminados: this.changes });
  });
});

module.exports = router;
