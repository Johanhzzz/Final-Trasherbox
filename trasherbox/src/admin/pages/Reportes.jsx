import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasRes, usuariosRes, stockRes] = await Promise.all([
          axios.get("http://localhost:3001/api/reportes/ventas"),
          axios.get("http://localhost:3001/api/reportes/usuarios"),
          axios.get("http://localhost:3001/api/reportes/stock-bajo"),
        ]);

        setVentas(ventasRes.data);
        setUsuarios(usuariosRes.data);
        setStockBajo(stockRes.data);

        const ventasFormatted = ventasRes.data.map((v) => ({
          tipo: "venta",
          fecha: v.fecha,
          total_ventas: v.total_ventas,
          total_recaudado: v.total_recaudado,
        }));

        const usuariosFormatted = usuariosRes.data.map((u) => ({
          tipo: "usuario",
          email: u.email,
          usuario: u.usuario,
          telefono: u.telefono,
        }));

        const stockFormatted = stockRes.data.map((s) => ({
          tipo: "stock_bajo",
          producto: s.titulo,
          stock: s.stock,
        }));

        setCsvData([...ventasFormatted, ...usuariosFormatted, ...stockFormatted]);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="reportes-container">
      <style>{`
        .reportes-container {
          padding: 20px;
          max-width: 900px;
          margin: auto;
          background: #f9f9f9;
          border-radius: 10px;
          font-family: sans-serif;
        }
        h2 {
          margin-bottom: 20px;
          text-align: center;
        }
        section {
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 10px;
        }
        th, td {
          padding: 8px;
          border: 1px solid #ccc;
          text-align: left;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 5px;
        }
        .csv-button {
          display: inline-block;
          margin: 10px 0;
          background-color: #007bff;
          padding: 8px 14px;
          color: white;
          border-radius: 5px;
          text-decoration: none;
          font-size: 14px;
        }
        .csv-button:hover {
          background-color: #0056b3;
        }
        @media (max-width: 600px) {
          .reportes-container {
            padding: 10px;
          }
          table, th, td {
            font-size: 12px;
          }
        }
      `}</style>

      <h2>📊 Reportes del sistema</h2>

      <section>
        <h3>🧾 Ventas por fecha</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Total ventas</th>
              <th>Total recaudado</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta, index) => (
              <tr key={index}>
                <td>{venta.fecha}</td>
                <td>{venta.total_ventas}</td>
                <td>${venta.total_recaudado}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <CSVLink className="csv-button" data={ventas} filename={"reporte_ventas.csv"}>
          📥 Descargar ventas CSV
        </CSVLink>
      </section>

      <section>
        <h3>👤 Usuarios registrados</h3>
        <ul>
          {usuarios.map((user, index) => (
            <li key={index}>
              📧 {user.email} — 👤 {user.usuario} — 📞 {user.telefono}
            </li>
          ))}
        </ul>
        <CSVLink className="csv-button" data={usuarios} filename={"usuarios_registrados.csv"}>
          📥 Descargar usuarios CSV
        </CSVLink>
      </section>

      <section>
        <h3>⚠️ Productos con bajo stock</h3>
        <ul>
          {stockBajo.map((item, index) => (
            <li key={index}>
              {item.titulo} - Stock: {item.stock}
            </li>
          ))}
        </ul>
        <CSVLink className="csv-button" data={stockBajo} filename={"stock_bajo.csv"}>
          📥 Descargar stock CSV
        </CSVLink>
      </section>

      <section>
        <h3>📦 Reporte completo</h3>
        <CSVLink className="csv-button" data={csvData} filename={"reporte_completo.csv"}>
          📦 Descargar todo en un CSV
        </CSVLink>
      </section>
    </div>
  );
};

export default Reportes;
