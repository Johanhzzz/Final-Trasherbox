const express = require("express");
const db = require("../db/connection");
const router = express.Router();

// Listar productos disponibles
router.get("/productos", (req, res) => {
  db.all("SELECT * FROM producto WHERE estado = 'disponible'", (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener productos" });
    res.json(rows);
  });
});

// Crear producto
router.post("/productos", (req, res) => {
  const {
    titulo, descripcion, precio, precio_anterior, descuento,
    imagen, estado, resenas, calificacion, categoria
  } = req.body;

  if (!titulo || !precio)
    return res.status(400).json({ error: "Faltan campos obligatorios (titulo, precio)" });

  db.run(
    `INSERT INTO producto (titulo, descripcion, precio, precio_anterior, descuento, imagen, estado, resenas, calificacion, categoria)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      titulo, descripcion, precio, precio_anterior, descuento, imagen,
      estado || "disponible", resenas || 0, calificacion || 5, categoria || "otros"
    ],
    function (err) {
      if (err) return res.status(500).json({ error: "Error al insertar producto" });
      res.json({ id: this.lastID });
    }
  );
});

// Actualizar producto
router.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const {
    titulo, descripcion, precio, precio_anterior, descuento,
    imagen, estado, resenas, calificacion, categoria
  } = req.body;

  db.run(
    `UPDATE producto SET 
      titulo=?, descripcion=?, precio=?, precio_anterior=?, descuento=?, 
      imagen=?, estado=?, resenas=?, calificacion=?, categoria=?
     WHERE id=?`,
    [
      titulo, descripcion, precio, precio_anterior, descuento,
      imagen, estado, resenas, calificacion, categoria, id
    ],
    function (err) {
      if (err) return res.status(500).json({ error: "Error al actualizar producto" });
      res.json({ success: true, cambios: this.changes });
    }
  );
});

// Eliminar producto
router.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM producto WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Error al eliminar producto" });
    res.json({ success: true, eliminados: this.changes });
  });
});

module.exports = router;
