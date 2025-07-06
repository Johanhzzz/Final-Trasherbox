import { useEffect, useState } from "react";

function Dashboard() {
  const [kpis, setKpis] = useState({
    usuarios: 0,
    productos: 0,
    ordenes: 0
  });

  useEffect(() => {
    fetch("http://localhost:3001/api/admin/dashboard-summary")
      .then((res) => res.json())
      .then((data) => {
        setKpis({
          usuarios: data.usuarios || 0,
          productos: data.productos || 0,
          ordenes: data.ordenes || 0
        });
      })
      .catch((err) => console.error("Error cargando KPIs:", err));
  }, []);

  const kpiStyle = {
    container: {
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
      margin: "20px 0",
      flexWrap: "wrap"
    },
    card: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "200px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      textAlign: "center"
    },
    h4: {
      marginBottom: "10px",
      fontSize: "16px",
      color: "#666"
    },
    p: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333"
    }
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
    </div>
  );
}

export default Dashboard;
