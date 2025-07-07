import axios from "axios";

function Checkout() {
  const pagar = () => {
    axios
      .post("/api/crear-transaccion", {
        total: 10000, // Cambia esto si quieres que el monto sea dinámico
      })
      .then((res) => {
        window.location.href = res.data.url;
      })
      .catch((err) => {
        console.error("Error al iniciar pago:", err);
        alert("Hubo un error al iniciar el pago.");
      });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pago con Webpay</h2>
      <button onClick={pagar}>Pagar $10.000</button>
    </div>
  );
}

export default Checkout;
