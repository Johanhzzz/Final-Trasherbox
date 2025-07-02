import { useEffect, useState } from "react";

function Dashboard() {
  const [usuarios, setUsuarios] = useState(0);
  const [contactos, setContactos] = useState(0);
  const [productos, setProductos] = useState(0);
  const [ordenes, setOrdenes] = useState(0);

  useEffect(() => {
    // Simulación de carga de datos
    setUsuarios(42);
    setContactos(8);
    setProductos(15);
    setOrdenes(27);
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
          <p style={kpiStyle.p}>{usuarios}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Solicitudes de contacto</h4>
          <p style={kpiStyle.p}>{contactos}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Productos publicados</h4>
          <p style={kpiStyle.p}>{productos}</p>
        </div>
        <div style={kpiStyle.card}>
          <h4 style={kpiStyle.h4}>Órdenes realizadas</h4>
          <p style={kpiStyle.p}>{ordenes}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
