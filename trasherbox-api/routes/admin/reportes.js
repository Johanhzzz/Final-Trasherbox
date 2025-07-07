const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const { Parser } = require("json2csv");

// 🧾 Ventas por fecha - JSON
router.get("/ventas", (req, res) => {
  const query = `
    SELECT 
      DATE(fecha) AS fecha,
      COUNT(*) AS total_ventas,
      SUM(total) AS total_recaudado
    FROM venta
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

// 📥 Descargar ventas - CSV
router.get("/ventas.csv", (req, res) => {
  const query = `
    SELECT 
      DATE(fecha) AS fecha,
      COUNT(*) AS total_ventas,
      SUM(total) AS total_recaudado
    FROM venta
    GROUP BY DATE(fecha)
    ORDER BY fecha DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).send("Error al generar CSV de ventas");

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("ventas.csv");
    res.send(csv);
  });
});

// 👤 Usuarios registrados - JSON
router.get("/usuarios", (req, res) => {
  db.all("SELECT id, email, usuario FROM usuario", [], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo usuarios:", err.message);
      return res.status(500).json({ error: "Error en reporte de usuarios" });
    }
    res.json(rows);
  });
});

// 📥 Descargar usuarios - CSV
router.get("/usuarios.csv", (req, res) => {
  db.all("SELECT id, email, usuario FROM usuario", [], (err, rows) => {
    if (err) return res.status(500).send("Error al generar CSV de usuarios");

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("usuarios.csv");
    res.send(csv);
  });
});

// ⚠️ Productos con bajo stock - JSON
router.get("/stock-bajo", (req, res) => {
  db.all("SELECT titulo, stock FROM producto WHERE stock <= 5", [], (err, rows) => {
    if (err) {
      console.error("❌ Error obteniendo stock bajo:", err.message);
      return res.status(500).json({ error: "Error en reporte de stock" });
    }
    res.json(rows);
  });
});

// 📥 Descargar stock bajo - CSV
router.get("/stock-bajo.csv", (req, res) => {
  db.all("SELECT titulo, stock FROM producto WHERE stock <= 5", [], (err, rows) => {
    if (err) return res.status(500).send("Error al generar CSV de stock bajo");

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header("Content-Type", "text/csv");
    res.attachment("stock_bajo.csv");
    res.send(csv);
  });
});

module.exports = router;
