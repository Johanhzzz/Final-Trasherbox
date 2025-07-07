import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ConfirmarTransaccion() {
  const [mensaje, setMensaje] = useState("Confirmando transacción...");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token_ws");

    if (!token) {
      setMensaje("❌ Token no proporcionado");
      return;
    }

    axios
      .post("http://localhost:3001/api/confirmar-transaccion", { token })
      .then((res) => {
        if (res.data.status === "AUTHORIZED") {
          setMensaje("✅ ¡Pago exitoso! Muchas gracias por tu compra.");
        } else {
          setMensaje("⚠️ El pago fue rechazado o no autorizado.");
        }
      })
      .catch((err) => {
        console.error(err);
        setMensaje("❌ Error al confirmar la transacción.");
      });
  }, [searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>{mensaje}</h2>
    </div>
  );
}

export default ConfirmarTransaccion;
