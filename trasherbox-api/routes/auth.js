const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { email, password, usuario, telefono } = req.body;
  if (!email || !password || !usuario || !telefono)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO usuario (email, password_hash, usuario, telefono) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, usuario, telefono],
      function (err) {
        if (err) return res.status(400).json({ error: "Usuario ya existe o error al registrar" });
        res.status(200).json({ success: true, userId: this.lastID });
      }
    );
  } catch {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Login
router.post("/login", (req, res) => {
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

module.exports = router;
