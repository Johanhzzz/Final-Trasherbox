const express = require("express");
const router = express.Router();
const db = require("../../db/connection");

// KPIs resumen
router.get("/admin/dashboard-summary", async (req, res) => {
  try {
    const usuarios = await db.get("SELECT COUNT(*) as total FROM usuarios");
    const productos = await db.get("SELECT COUNT(*) as total FROM productos");
    const pedidos = await db.get("SELECT COUNT(*) as total FROM pedidos");

    res.json({
      usuarios: usuarios.total,
      productos: productos.total,
      pedidos: pedidos.total,
    });
  } catch (err) {
    console.error("❌ Error dashboard-summary:", err.message);
    res.status(500).json({ error: "Error usuarios" });
  }
});

// Productos agrupados por categoría
router.get("/admin/productos-por-categoria", async (req, res) => {
  try {
    const resultado = await db.all(`
      SELECT categoria, COUNT(*) as total
      FROM productos
      GROUP BY categoria
    `);
    res.json(resultado);
  } catch (err) {
    console.error("❌ Error agrupando productos:", err.message);
    res.status(500).json({ error: "Error al agrupar productos" });
  }
});

module.exports = router;
