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
  const [kpis, setKpis] = useState({ usuarios: 0, productos: 0, ordenes: 0 });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Obtener KPIs
    fetch("http://localhost:3001/api/admin/dashboard-summary")
      .then((res) => res.json())
      .then((data) => setKpis(data))
      .catch((err) => {
        console.error("❌ Error cargando KPIs:", err);
        setKpis({ usuarios: 0, productos: 0, ordenes: 0 });
      });

    // Obtener productos por categoría
    fetch("http://localhost:3001/api/admin/productos-por-categoria")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Data recibida:", data);
        if (Array.isArray(data)) {
          setCategorias(data);
        } else {
          console.warn("⚠️ Categorías no es un array:", data);
          setCategorias([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error cargando categorías:", err);
        setCategorias([]);
      });
  }, []);

  const chartData = {
    labels: categorias.map((c) => c.categoria),
    datasets: [
      {
        label: "Productos por categoría",
        data: categorias.map((c) => c.total),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const kpiStyle = {
    container: {
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
      margin: "20px 0",
      flexWrap: "wrap",
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "200px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard del Admin</h2>

      <div style={kpiStyle.container}>
        <div style={kpiStyle.card}>
          <h4>Usuarios registrados</h4>
          <p>{kpis.usuarios}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4>Productos publicados</h4>
          <p>{kpis.productos}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4>Órdenes realizadas</h4>
          <p>{kpis.pedidos}</p>
        </div>
      </div>

      <div>
        <h4>Productos por categoría</h4>
        {categorias.length === 0 ? (
          <p>No hay datos disponibles.</p>
        ) : (
          <div style={{ maxWidth: "600px" }}>
            <Bar data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
