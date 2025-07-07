const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Resumen para KPIs
router.get("/admin/dashboard-summary", (req, res) => {
  const kpis = {
    usuarios: 0,
    productos: 0,
    pedidos: 0,
  };

  db.get("SELECT COUNT(*) AS total FROM usuarios", (err, row) => {
    if (err) return res.status(500).json({ error: "Error usuarios" });
    kpis.usuarios = row.total;

    db.get("SELECT COUNT(*) AS total FROM productos", (err2, row2) => {
      if (err2) return res.status(500).json({ error: "Error productos" });
      kpis.productos = row2.total;

      db.get("SELECT COUNT(*) AS total FROM ordenes", (err3, row3) => {
        if (err3) return res.status(500).json({ error: "Error ordenes" });
        kpis.pedidos = row3.total;
        res.json(kpis);
      });
    });
  });
});

// Productos agrupados por categoría (simulado por descripción en este caso)
router.get("/admin/productos-por-categoria", (req, res) => {
  db.all(
    `SELECT descripcion AS categoria, COUNT(*) AS total 
     FROM productos 
     GROUP BY descripcion`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Error al agrupar productos" });
      res.json(rows);
    }
  );
});

module.exports = router;
