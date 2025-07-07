import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ConfirmarTransaccion() {
  const [searchParams] = useSearchParams();
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const token_ws = searchParams.get("token_ws");

    if (token_ws) {
      axios
        .post("http://localhost:3001/api/confirmar-transaccion", { token_ws })
        .then((res) => {
          setResultado(res.data);
        })
        .catch((err) => {
          console.error(err);
          setResultado({ status: "ERROR", message: "Error confirmando pago." });
        });
    }
  }, [searchParams]);

  if (!resultado) return <p>Confirmando transacción...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Resultado del Pago</h2>
      <pre>{JSON.stringify(resultado, null, 2)}</pre>

      {resultado.status === "AUTHORIZED" && (
        <p style={{ color: "green" }}>✅ Pago exitoso</p>
      )}
      {resultado.status !== "AUTHORIZED" && (
        <p style={{ color: "red" }}>❌ Pago rechazado</p>
      )}
    </div>
  );
}

export default ConfirmarTransaccion;
