const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const { Parser } = require("json2csv"); // convierte JSON a CSV

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
