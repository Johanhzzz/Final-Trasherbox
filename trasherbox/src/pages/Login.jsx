import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.rol === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/panel");
        }
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, usuario, telefono }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setUsuario("");
        setTelefono("");
      } else {
        setError(data.error || "Error al registrar usuario");
      }
    } catch (err) {
      setError("Error de conexión con el servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegister ? "Registrarse" : "Iniciar Sesión"}</h2>

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <>
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </>
          )}

          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isRegister && (
            <p className="olvide-contrasena">
              <button
                type="button"
                className="link-button"
                onClick={() => navigate("/recuperar")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </p>
          )}

          {isRegister && (
            <>
              <label>Teléfono</label>
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </>
          )}

          {error && <div className="error">{error}</div>}

          <button type="submit">
            {isRegister ? "Registrarse" : "Entrar"}
          </button>
        </form>

        <p>
          {isRegister ? (
            <>
              ¿Ya tienes cuenta?{" "}
              <button onClick={() => setIsRegister(false)}>Inicia sesión</button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{" "}
              <button onClick={() => setIsRegister(true)}>Regístrate</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Login;
