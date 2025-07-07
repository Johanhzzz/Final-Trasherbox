const express = require("express");
const router = express.Router();
const dbPromise = require("../../db/connection");

// Ruta: /admin/dashboard-summary
router.get("/dashboard-summary", async (req, res) => {
  try {
    const db = await dbPromise;

    const usuarios = await db.get("SELECT COUNT(*) as total FROM usuarios");
    const productos = await db.get("SELECT COUNT(*) as total FROM productos");
    const pedidos = await db.get("SELECT COUNT(*) as total FROM pedidos");

    res.json({
      usuarios: usuarios?.total || 0,
      productos: productos?.total || 0,
      pedidos: pedidos?.total || 0,
    });
  } catch (err) {
    console.error("❌ Error en /dashboard-summary:", err.message);
    res.status(500).json({ error: "Error al obtener resumen del dashboard" });
  }
});

// Ruta: /admin/productos-por-categoria
router.get("/productos-por-categoria", async (req, res) => {
  try {
    const db = await dbPromise;

    const resultado = await db.all(`
      SELECT categoria, COUNT(*) as total
      FROM productos
      GROUP BY categoria
    `);

    res.json(resultado);
  } catch (err) {
    console.error("❌ Error en /productos-por-categoria:", err.message);
    res.status(500).json({ error: "Error al agrupar productos por categoría" });
  }
});

module.exports = router;
