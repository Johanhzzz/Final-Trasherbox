const express = require("express");
const fetch = require("node-fetch");
const db = require("../db/connection");

const router = express.Router();

// Endpoint para crear transacción
router.post("/crear-transaccion", async (req, res) => {
  const { total } = req.body;

  const buyOrder = `ORDEN${Math.floor(Math.random() * 1000000)}`;
  const sessionId = `SESION${Math.floor(Math.random() * 1000000)}`;
  const returnUrl = "http://localhost:5173/confirmar-transaccion";

  try {
    const response = await fetch(
      "https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions",
      {
        method: "POST",
        headers: {
          "Tbk-Api-Key-Id": "597055555532", // ID de integración (no cambiar en pruebas)
          "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // Clave secreta de integración
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buy_order: buyOrder,
          session_id: sessionId,
          amount: total,
          return_url: returnUrl,
        }),
      }
    );

    const data = await response.json();

    res.json({
      url: `${data.url}?token_ws=${data.token}`,
      token: data.token,
    });
  } catch (error) {
    console.error("❌ Error creando transacción:", error.message);
    res.status(500).json({ error: "Error al crear transacción" });
  }
});

// Endpoint para confirmar transacción
router.post("/confirmar-transaccion", async (req, res) => {
  const { token_ws } = req.body;

  try {
    const response = await fetch(
      `https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions/${token_ws}`,
      {
        method: "PUT",
        headers: {
          "Tbk-Api-Key-Id": "597055555532",
          "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Guardar orden en la base de datos
    db.run(
      `INSERT INTO orden (token, estado, monto, fecha) VALUES (?, ?, ?, datetime('now'))`,
      [token_ws, data.status, data.amount],
      function (err) {
        if (err) console.error("❌ Error guardando orden:", err.message);
        else console.log("✅ Orden guardada, ID:", this.lastID);
      }
    );

    res.json(data);
  } catch (error) {
    console.error("❌ Error confirmando transacción:", error.message);
    res.status(500).json({ error: "Error al confirmar transacción" });
  }
});

module.exports = router;
