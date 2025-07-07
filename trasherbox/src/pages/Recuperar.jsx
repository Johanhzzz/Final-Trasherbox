import { useState } from "react";
import "./Login.css"; // Usa el mismo estilo del login

function Recuperar() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/recuperar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Se ha enviado un correo con instrucciones para restablecer tu contraseña.");
        setEmail("");
      } else {
        setError(data.error || "Error al enviar el correo de recuperación.");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Recuperar contraseña</h2>

        <form onSubmit={handleRecuperar}>
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}
          {mensaje && <div className="success">{mensaje}</div>}

          <button type="submit">Enviar enlace</button>
        </form>
      </div>
    </div>
  );
}

export default Recuperar;
