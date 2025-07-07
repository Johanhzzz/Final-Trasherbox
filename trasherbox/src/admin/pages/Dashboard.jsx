import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [kpis, setKpis] = useState({ usuarios: 0, productos: 0, ventas: 0 });
  const [categorias, setCategorias] = useState([]);
  const [ventasPorMes, setVentasPorMes] = useState([]);

  useEffect(() => {
    // KPIs
    fetch("http://localhost:3001/api/admin/dashboard-summary")
      .then((res) => res.json())
      .then((data) => setKpis(data))
      .catch(() => setKpis({ usuarios: 0, productos: 0, ventas: 0 }));

    // Productos por categoría
    fetch("http://localhost:3001/api/admin/productos-por-categoria")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setCategorias(data) : setCategorias([]))
      .catch(() => setCategorias([]));

    // Ventas por mes
    fetch("http://localhost:3001/api/admin/ventas-por-mes")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) ? setVentasPorMes(data) : setVentasPorMes([]))
      .catch(() => setVentasPorMes([]));
  }, []);

  const productosChart = {
    labels: categorias.map((c) => c.categoria),
    datasets: [
      {
        label: "Stock por categoría",
        data: categorias.map((c) => c.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const ventasChart = {
    labels: ventasPorMes.map((v) => v.mes),
    datasets: [
      {
        label: "Ingresos ($) por mes",
        data: ventasPorMes.map((v) => v.total_ingresos),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const styles = {
    container: {
      padding: "20px",
    },
    kpiContainer: {
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
      marginBottom: "30px",
      flexWrap: "wrap",
    },
    kpiCard: {
      background: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "200px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    chartsWrapper: {
      display: "flex",
      flexWrap: "wrap",
      gap: "30px",
      justifyContent: "center",
    },
    chartBox: {
      width: "500px",
      maxWidth: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Dashboard del Admin</h2>

      <div style={styles.kpiContainer}>
        <div style={styles.kpiCard}>
          <h4>Usuarios registrados</h4>
          <p>{kpis.usuarios}</p>
        </div>
        <div style={styles.kpiCard}>
          <h4>Productos publicados</h4>
          <p>{kpis.productos}</p>
        </div>
        <div style={styles.kpiCard}>
          <h4>Ventas realizadas</h4>
          <p>{kpis.ventas}</p>
        </div>
      </div>

      <div style={styles.chartsWrapper}>
        <div style={styles.chartBox}>
          <h4>Productos por categoría</h4>
          {categorias.length > 0 ? <Bar data={productosChart} /> : <p>No hay datos.</p>}
        </div>

        <div style={styles.chartBox}>
          <h4>Ventas por mes</h4>
          {ventasPorMes.length > 0 ? <Bar data={ventasChart} /> : <p>No hay datos.</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
