const express = require("express");
const db = require("../db/connection");
const router = express.Router();

// Obtener carrito por ID de usuario
router.get("/carrito/:userId", (req, res) => {
  const { userId } = req.params;
  db.all("SELECT * FROM carrito WHERE usuario_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener carrito" });
    res.json(rows);
  });
});

// Agregar producto al carrito
router.post("/carrito", (req, res) => {
  const { usuario_id, producto_id, cantidad } = req.body;

  if (!usuario_id || !producto_id)
    return res.status(400).json({ error: "Faltan campos obligatorios" });

  db.run(
    `INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES (?, ?, ?)`,
    [usuario_id, producto_id, cantidad || 1],
    function (err) {
      if (err) return res.status(500).json({ error: "Error al agregar al carrito" });
      res.json({ id: this.lastID });
    }
  );
});

// Eliminar producto del carrito
router.delete("/carrito/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM carrito WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Error al eliminar producto" });
    res.json({ eliminados: this.changes });
  });
});

// Vaciar carrito de un usuario
router.delete("/carrito/usuario/:userId", (req, res) => {
  const { userId } = req.params;
  db.run("DELETE FROM carrito WHERE usuario_id = ?", [userId], function (err) {
    if (err) return res.status(500).json({ error: "Error al vaciar carrito" });
    res.json({ eliminados: this.changes });
  });
});

module.exports = router;
