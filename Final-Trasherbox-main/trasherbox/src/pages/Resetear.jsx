import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Login.css"; // Usamos estilos reutilizados

function Resetear() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Para debug visual (verificar renderizado)
  useEffect(() => {
    console.log("✅ Página Resetear cargada con token:", token);
    setLoading(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (nuevaPassword !== confirmacion) {
      setError("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/resetear-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ ¡Contraseña restablecida con éxito!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "❌ Error al restablecer la contraseña.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Error al conectar con el servidor.");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Cargando formulario...</h2>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            required
          />

          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          />

          <button type="submit">Guardar nueva contraseña</button>
        </form>

        {mensaje && <div className="success">{mensaje}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default Resetear;
