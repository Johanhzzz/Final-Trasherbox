import { useEffect, useState } from "react";
import "./Carrito.css";

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

  const actualizarCantidad = (id, nuevaCantidad) => {
    const actualizado = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: nuevaCantidad } : item
    );
    setCartItems(actualizado);
    localStorage.setItem("cart", JSON.stringify(actualizado));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const pagar = () => {
    alert("En el futuro se conectará con Transbank 🚀");
    // Aquí se integrará el flujo con la API de Transbank
  };

  return (
    <div className="carrito-container">
      <h1>🛒 Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <table className="carrito-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Imagen</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <img src={item.image} alt={item.title} width="60" />
                  </td>
                  <td>${item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        actualizarCantidad(item.id, parseInt(e.target.value))
                      }
                    />
                  </td>
                  <td>${(item.price * item.quantity).toFixed(0)}</td>
                  <td>
                    <button onClick={() => eliminarProducto(item.id)}>
                      ❌ Eliminar
                    </button>
                  </td>
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
        </>
      )}
    </div>
  );
}

export default Carrito;
