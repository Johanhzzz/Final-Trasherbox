const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// 🧾 Reporte: Ventas por fecha
router.get("/ventas", (req, res) => {
  const query = `
    SELECT 
      DATE(fecha) AS fecha,
      COUNT(*) AS total_ventas,
      SUM(monto) AS total_recaudado
    FROM orden
    GROUP BY DATE(fecha)
    ORDER BY fecha DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo ventas:", err.message);
      return res.status(500).json({ error: "Error en reporte de ventas" });
    }
    res.json(rows);
  });
});

// 👤 Reporte: Usuarios registrados
router.get("/usuarios", (req, res) => {
  db.all("SELECT id, nombre, correo FROM usuarios", [], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo usuarios:", err.message);
      return res.status(500).json({ error: "Error en reporte de usuarios" });
    }
    res.json(rows);
  });
});

// ⚠️ Reporte: Productos con bajo stock
router.get("/stock-bajo", (req, res) => {
  db.all("SELECT titulo, stock FROM productos WHERE stock <= 5", [], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo stock bajo:", err.message);
      return res.status(500).json({ error: "Error en reporte de stock" });
    }
    res.json(rows);
  });
});

module.exports = router;
