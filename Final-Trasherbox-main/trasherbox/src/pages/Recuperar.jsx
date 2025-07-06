import { useState } from "react";
import "./Login.css";

function Recuperar() {
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await fetch("http://localhost:3001/api/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleRecuperar}>
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar enlace</button>
        </form>
        {mensaje && <div className="success">{mensaje}</div>}
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default Recuperar;
