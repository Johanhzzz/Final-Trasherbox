import { useEffect, useState } from "react";
import "./Carrito.css";
import axios from "axios";

function Carrito() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(carritoGuardado);
  }, []);

  const eliminarProducto = (id) => {
    const nuevoCarrito = cartItems.filter((item) => item.id !== id);
    setCartItems(nuevoCarrito);
    localStorage.setItem("cart", JSON.stringify(nuevoCarrito));
  };

  const cambiarCantidad = (id, delta) => {
    const actualizado = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    setCartItems(actualizado);
    localStorage.setItem("cart", JSON.stringify(actualizado));
  };

  const pagar = async () => {
    try {
      const monto = Math.round(
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      );

      const response = await axios.post("http://localhost:3001/api/crear-transaccion", {
        total: monto,
      });

      const { url } = response.data;
      window.location.href = url;
    } catch (error) {
      console.error("❌ Error al iniciar el pago:", error);
      alert("Error al iniciar el pago");
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const ENVIO_GRATIS_LIMITE = 30000;

  return (
    <div className="carrito-container">
      <h1>Mi carrito</h1>

      {total < ENVIO_GRATIS_LIMITE && (
        <p className="envio-mensaje">
          ¡Agrega ${ENVIO_GRATIS_LIMITE - total} más y obtén envío gratis!
        </p>
      )}

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div className="carrito-lista">
          <table className="carrito-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ textAlign: "center" }}>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className="carrito-producto">
                    <img src={item.image} alt={item.title} className="carrito-img" />
                    <div>
                      <p className="carrito-titulo">{item.title}</p>
                      <p className="carrito-precio">
                        <span className="precio-descuento">${item.price}</span>{" "}
                        <span className="precio-original">
                          ${(item.price * 1.3).toFixed(0)}
                        </span>
                      </p>
                      <button onClick={() => eliminarProducto(item.id)} className="btn-eliminar">
                        Eliminar
                      </button>
                    </div>
                  </td>
                  <td className="carrito-cantidad">
                    <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="carrito-total">
            <h3>Total: ${total.toFixed(0)}</h3>
            <button className="boton-pagar" onClick={pagar}>
              Proceder al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
