import React, { useEffect, useState } from "react";

function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ventasRes = await fetch("http://localhost:3001/api/reportes/ventas");
        const ventasData = await ventasRes.json();
        setVentas(ventasData);

        const usuariosRes = await fetch("http://localhost:3001/api/reportes/usuarios");
        const usuariosData = await usuariosRes.json();
        setUsuarios(usuariosData);

        const stockRes = await fetch("http://localhost:3001/api/reportes/stock-bajo");
        const stockData = await stockRes.json();
        setStockBajo(stockData);

        setLoading(false);
      } catch (error) {
        console.error("❌ Error cargando reportes:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>⏳ Cargando reportes...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Reportes del sistema</h2>

      <section>
        <h3>🧾 Ventas por fecha</h3>
        {ventas.length === 0 ? (
          <p>No hay datos de ventas.</p>
        ) : (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Total ventas</th>
                <th>Total recaudado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((v, i) => (
                <tr key={i}>
                  <td>{v.fecha}</td>
                  <td>{v.total_ventas}</td>
                  <td>${v.total_recaudado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>👤 Usuarios registrados</h3>
        {usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <ul>
            {usuarios.map((u) => (
              <li key={u.id}>
                <strong>{u.nombre}</strong> – {u.correo}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h3>⚠️ Productos con bajo stock</h3>
        {stockBajo.length === 0 ? (
          <p>Todos los productos tienen stock suficiente.</p>
        ) : (
          <ul>
            {stockBajo.map((p, i) => (
              <li key={i}>
                {p.titulo} - Stock: {p.stock}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Reportes;
