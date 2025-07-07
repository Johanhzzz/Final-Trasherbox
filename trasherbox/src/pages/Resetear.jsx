import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Login.css";

function Resetear() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
  e.preventDefault();
  setMensaje("");
  setError("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,}$/;

    if (!passwordRegex.test(password)) {
        setError(
        "La nueva contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un símbolo."
        );
        return;
    }

    if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3001/api/resetear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaPassword: password }),
        });

        const data = await response.json();

        if (response.ok) {
        setMensaje("✅ Tu contraseña fue restablecida correctamente.");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/"), 3000);
        } else {
        setError(data.error || "Error al restablecer la contraseña.");
        }
    } catch (err) {
        setError("Error de conexión con el servidor.");
    }
    };


  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Restablecer Contraseña</h2>

        <form onSubmit={handleReset}>
          <label>Nueva Contraseña</label>
          <input
            type="password"
            placeholder="Escribe tu nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="Confirma tu nueva contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="error">{error}</div>}
          {mensaje && <div className="success">{mensaje}</div>}

          <button type="submit">Guardar nueva contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default Resetear;
