import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [kpis, setKpis] = useState({
    usuarios: 0,
    productos: 0,
    ordenes: 0,
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // 🛠️ Ajuste de rutas: ahora tienen /api al principio
    fetch("http://localhost:3001/api/dashboard-summary")
      .then((res) => res.json())
      .then((data) => {
        setKpis({
          usuarios: data.usuarios || 0,
          productos: data.productos || 0,
          ordenes: data.pedidos || 0,
        });
      })
      .catch((err) => {
        console.error("❌ Error cargando KPIs:", err);
        setKpis({ usuarios: 0, productos: 0, ordenes: 0 });
      });

    fetch("http://localhost:3001/api/productos-por-categoria")
      .then((res) => res.json())
      .then((data) => {
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
    h4: {
      marginBottom: "10px",
      fontSize: "16px",
      color: "#666",
    },
    p: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard del Admin</h2>

      <div style={kpiStyle.container}>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Usuarios registrados</h4>
          <p style={kpiStyle.p}>{kpis.usuarios}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Productos publicados</h4>
          <p style={kpiStyle.p}>{kpis.productos}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Órdenes realizadas</h4>
          <p style={kpiStyle.p}>{kpis.ordenes}</p>
        </div>
      </div>

      <h3 style={{ marginTop: "40px" }}>Productos por categoría</h3>
      {categorias.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </div>
  );
}

export default Dashboard;
