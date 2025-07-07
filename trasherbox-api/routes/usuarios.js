const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const router = express.Router();

// Middleware para verificar si es admin
function verifyAdmin(req, res, next) {
  const email = req.body.adminEmail || req.query.adminEmail;
  if (!email) return res.status(400).json({ error: "Falta adminEmail" });

  db.get("SELECT rol FROM usuario WHERE email = ?", [email], (err, row) => {
    if (err || !row || row.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado: solo administradores" });
    }
    next();
  });
}

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

  if (!email || !password || !usuario || !telefono || !rol) {
    return res.status(400).json({ error: "Faltan campos" });
  }

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
router.put("/admin/users/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { email, usuario, telefono, rol, password } = req.body;

  const updateFields = [email, usuario, telefono, rol];
  let query = "UPDATE usuario SET email=?, usuario=?, telefono=?, rol=?";

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    query += ", password_hash=?";
    updateFields.push(hashed);
  }

  query += " WHERE id=?";
  updateFields.push(id);

  db.run(query, updateFields, function (err) {
    if (err) return res.status(400).json({ error: "Error al actualizar" });
    res.json({ cambios: this.changes });
  });
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
