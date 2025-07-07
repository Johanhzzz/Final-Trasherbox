const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const { Parser } = require("json2csv");

// Ruta 1: Obtener ventas agrupadas por fecha
router.get("/ventas", (req, res) => {
  const query = `
    SELECT 
      DATE(fecha) AS fecha,
      COUNT(*) AS total_ventas,
      SUM(total) AS total_recaudado
    FROM orden
    GROUP BY DATE(fecha)
    ORDER BY fecha DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta 2: Obtener usuarios registrados
router.get("/usuarios", (req, res) => {
  const query = `
    SELECT id, email, usuario, telefono FROM usuario
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta 3: Obtener productos con stock bajo
router.get("/stock-bajo", (req, res) => {
  const query = `
    SELECT titulo, stock FROM producto WHERE stock <= 5
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta 4: Descargar reporte completo en CSV
router.get("/descargar-todo", (req, res) => {
  const consultas = {
    ventas: `
      SELECT 
        DATE(fecha) AS fecha,
        COUNT(*) AS total_ventas,
        SUM(total) AS total_recaudado
      FROM orden
      GROUP BY DATE(fecha)
      ORDER BY fecha DESC
    `,
    usuarios: `SELECT id, email AS correo, usuario AS nombre, telefono FROM usuario`,
    stock: `SELECT titulo, stock FROM producto WHERE stock <= 5`
  };

  Promise.all(
    Object.entries(consultas).map(
      ([nombre, query]) =>
        new Promise((resolve, reject) =>
          db.all(query, [], (err, rows) =>
            err ? reject(err) : resolve({ [nombre]: rows })
          )
        )
    )
  )
    .then((resultados) => {
      const data = resultados.reduce((acc, cur) => ({ ...acc, ...cur }), {});
      const flat = [];

      data.ventas.forEach((v) => flat.push({
        tipo: "venta",
        fecha: v.fecha,
        total_ventas: v.total_ventas,
        total_recaudado: v.total_recaudado
      }));
      data.usuarios.forEach((u) => flat.push({
        tipo: "usuario",
        id: u.id,
        correo: u.correo,
        nombre: u.nombre,
        telefono: u.telefono
      }));
      data.stock.forEach((p) => flat.push({
        tipo: "stock_bajo",
        titulo: p.titulo,
        stock: p.stock
      }));

      const parser = new Parser();
      const csv = parser.parse(flat);

      res.header("Content-Type", "text/csv");
      res.attachment("reporte_completo.csv");
      res.send(csv);
    })
    .catch((err) => {
      console.error("❌ Error generando CSV:", err);
      res.status(500).json({ error: "Error generando reporte CSV" });
    });
});

module.exports = router;
