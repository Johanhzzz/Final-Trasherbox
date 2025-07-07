const express = require("express");
const router = express.Router();
const dbPromise = require("../../db/connection");

// Ruta: /dashboard-summary
router.get("/dashboard-summary", async (req, res) => {
  console.log("📥 GET /api/admin/dashboard-summary");

  try {
    const db = await dbPromise;

    const usuarios = await db.get("SELECT COUNT(*) as total FROM usuario");
    const productos = await db.get("SELECT COUNT(*) as total FROM producto");
    const ventas = await db.get("SELECT COUNT(*) as total FROM venta");

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
  } catch (err) {
    console.error("❌ Error en /dashboard-summary:", err.message);
    res.status(500).json({ error: "Error al obtener resumen del dashboard" });
  }
});

// Ruta: /productos-por-categoria
router.get("/productos-por-categoria", async (req, res) => {
  console.log("📥 GET /api/admin/productos-por-categoria");

  try {
    const db = await dbPromise;

    const resultado = await db.all(`
      SELECT categoria, COUNT(*) as total
      FROM producto
      WHERE categoria IS NOT NULL AND categoria != ''
      GROUP BY categoria
    `);

    console.log("📦 Resultado de productos por categoría:", resultado);
    res.json(resultado);
  } catch (err) {
    console.error("❌ Error en /productos-por-categoria:", err.message);
    res.status(500).json({ error: "Error al agrupar productos por categoría" });
  }
});

module.exports = router;
