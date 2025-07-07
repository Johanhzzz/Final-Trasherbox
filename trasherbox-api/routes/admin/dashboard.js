// trasherbox-api/routes/admin/dashboard.js

const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// Ruta: /dashboard-summary
router.get("/dashboard-summary", (req, res) => {
  console.log("📥 GET /api/admin/dashboard-summary");

  try {
    db.get("SELECT COUNT(*) as total FROM usuario", (err, usuarios) => {
      if (err) return res.status(500).json({ error: "Error al contar usuarios" });

      db.get("SELECT COUNT(*) as total FROM producto", (err, productos) => {
        if (err) return res.status(500).json({ error: "Error al contar productos" });

          db.get("SELECT COUNT(*) as total FROM venta", (err, ventas) => {
            if (err) return res.status(500).json({ error: "Error al contar ventas" });

            console.log("📊 Datos de resumen:", {
              usuarios: usuarios?.total,
              productos: productos?.total,
              ventas: ventas?.total,
            });

            res.json({
              usuarios: usuarios?.total || 0,
              productos: productos?.total || 0,
              ventas: ventas?.total || 0,
            });
          });
      });
    });
  } catch (err) {
    console.error("❌ Error en /dashboard-summary:", err.message);
    res.status(500).json({ error: "Error al obtener resumen del dashboard" });
  }
});

// Ruta: /productos-por-categoria
router.get("/productos-por-categoria", (req, res) => {
  console.log("📥 GET /api/admin/productos-por-categoria");

  try {
    db.all(
      `SELECT categoria, SUM(stock) as total
       FROM producto
       WHERE categoria IS NOT NULL AND categoria != ''
       GROUP BY categoria`,
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ Error al obtener categorías:", err.message);
          return res.status(500).json({ error: "Error al agrupar productos por categoría" });
        }

        console.log("📦 Productos por categoría (stock):", rows);
        res.json(rows);
      }
    );
  } catch (err) {
    console.error("❌ Error en /productos-por-categoria:", err.message);
    res.status(500).json({ error: "Error al agrupar productos por categoría" });
  }
});

// Ruta: /ventas-por-mes
router.get("/ventas-por-mes", (req, res) => {
  console.log("📥 GET /api/admin/ventas-por-mes");

  try {
    db.all(
      `SELECT 
         strftime('%Y-%m', fecha) AS mes,
         COUNT(*) AS total_ventas,
         SUM(total) AS total_ingresos
       FROM venta
       GROUP BY mes
       ORDER BY mes ASC`,
      [],
      (err, rows) => {
        if (err) {
          console.error("❌ Error al obtener ventas por mes:", err.message);
          return res.status(500).json({ error: "Error al agrupar ventas por mes" });
        }

        console.log("📈 Ventas por mes:", rows);
        res.json(rows);
      }
    );
  } catch (err) {
    console.error("❌ Error en /ventas-por-mes:", err.message);
    res.status(500).json({ error: "Error al agrupar ventas por mes" });
  }
});

module.exports = router;
