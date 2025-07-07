const express = require("express");
const db = require("../db/connection");
const router = express.Router();

// GET - Obtener todos los productos
router.get("/productos", (req, res) => {
  db.all("SELECT * FROM producto", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Error al obtener productos" });
    res.json(rows);
  });
});

// POST - Crear nuevo producto
router.post("/productos", (req, res) => {
  const {
    titulo,
    descripcion,
    precio,
    precio_anterior,
    descuento,
    imagen,
    estado,
    resenas,
    calificacion,
  } = req.body;

  db.run(
    `INSERT INTO producto (
      titulo, descripcion, precio, precio_anterior, descuento,
      imagen, estado, resenas, calificacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [titulo, descripcion, precio, precio_anterior, descuento, imagen, estado, resenas, calificacion],
    function (err) {
      if (err) return res.status(400).json({ error: "Error al agregar producto" });
      res.json({ id: this.lastID });
    }
  );
});

// PUT - Actualizar producto
router.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    precio,
    precio_anterior,
    descuento,
    imagen,
    estado,
    resenas,
    calificacion,
  } = req.body;

  db.run(
    `UPDATE producto SET 
      titulo = ?, descripcion = ?, precio = ?, precio_anterior = ?, 
      descuento = ?, imagen = ?, estado = ?, resenas = ?, calificacion = ?
    WHERE id = ?`,
    [titulo, descripcion, precio, precio_anterior, descuento, imagen, estado, resenas, calificacion, id],
    function (err) {
      if (err) return res.status(400).json({ error: "Error al actualizar producto" });
      res.json({ actualizado: this.changes });
    }
  );
});

// DELETE - Eliminar producto
router.delete("/productos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM producto WHERE id = ?", [id], function (err) {
    if (err) return res.status(400).json({ error: "Error al eliminar producto" });
    res.json({ eliminado: this.changes });
  });
});

module.exports = router;
