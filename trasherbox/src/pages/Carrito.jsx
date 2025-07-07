import { useEffect, useState } from "react";
import "./Carrito.css";
import axios from "axios";

function Carrito() {
  const [cartItems, setCartItems] = useState([]);
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");
  const [errores, setErrores] = useState({ email: "", rut: "" });

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

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const ENVIO_GRATIS_LIMITE = 30000;

  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const validarRut = (rut) => {
    const limpio = rut.replace(/\./g, "").replace("-", "").toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;

    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);

    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const dvEsperado = 11 - (suma % 11);
    const dvCalculado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

    return dv === dvCalculado;
  };

  const pagar = async () => {
    const emailValido = validarEmail(email);
    const rutValido = validarRut(rut);

    setErrores({
      email: emailValido ? "" : "Correo inválido",
      rut: rutValido ? "" : "RUT inválido",
    });

    if (!emailValido || !rutValido) return;

    try {
      const totalRedondeado = Math.round(total);

      const res = await axios.post("http://localhost:3001/api/crear-transaccion", {
        total: totalRedondeado,
        email,
        rut,
      });

      window.location.href = res.data.url;
    } catch (error) {
      console.error("Error al crear transacción:", error);
      alert("Hubo un error al procesar el pago.");
    }
  };

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

            <div className="formulario-cliente">
              <input
                type="email"
                placeholder="Tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={60}
              />
              {errores.email && <p className="error">{errores.email}</p>}

              <input
                type="text"
                placeholder="Tu RUT (ej: 19475368-K)"
                maxLength={10}
                value={rut}
                onChange={(e) => {
                  let entrada = e.target.value.toUpperCase().replace(/[^0-9K]/g, "");
                  if (entrada.length > 9) entrada = entrada.slice(0, 9);

                  let formateado = entrada;
                  if (entrada.length > 1) {
                    const cuerpo = entrada.slice(0, -1);
                    const dv = entrada.slice(-1);
                    formateado = `${cuerpo}-${dv}`;
                  }

                  setRut(formateado);
                }}
              />
              {errores.rut && <p className="error">{errores.rut}</p>}
            </div>

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