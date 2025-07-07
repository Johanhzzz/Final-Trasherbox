const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const transporter = require("../utils/mailer");
const sqlite3 = require("sqlite3").verbose();
const usedTokens = new Set();



const router = express.Router();

// Ruta absoluta a la base de datos
const dbPath = path.resolve(__dirname, "../db/trasherbox.db");

// Conexión a SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ No se pudo conectar a la base de datos:", err.message);
  } else {
    console.log("✅ Conectado a trasherbox.db desde /db/");
  }
});

const SECRET = "secreto_recuperacion"; // Puedes moverlo a .env más adelante

// 1️⃣ Ruta: Enviar correo de recuperación
router.post("/recuperar", (req, res) => {
  const { email } = req.body;
  const emailLimpio = email.trim().toLowerCase();

  console.log("📨 Solicitando recuperación para:", emailLimpio);

  db.get("SELECT * FROM usuario WHERE email = ?", [emailLimpio], (err, user) => {
    if (err) {
      console.error("❌ ERROR EN CONSULTA SQL:", err.message);
      return res.status(500).json({ error: "Error en base de datos" });
    }

    if (!user) {
      console.log("🚫 Correo no encontrado:", emailLimpio);
      return res.status(404).json({ error: "Correo no registrado" });
    }

    const token = jwt.sign({ email: emailLimpio }, SECRET, { expiresIn: "15m" });
    const resetLink = `http://localhost:5173/resetear/${token}`;

    const mailOptions = {
      from: "trasherbox.soporte@gmail.com",
      to: emailLimpio,
      subject: "Restablecer contraseña - TrasherBox",
      html: `
        <h3>Recuperar contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña (válido por 15 minutos):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error al enviar el correo:", error);
        return res.status(500).json({ error: "Error enviando correo" });
      }

      console.log("📧 Correo de recuperación enviado a:", emailLimpio);
      res.json({ message: "Correo de recuperación enviado correctamente." });
    });
  });
});

// 2️⃣ Ruta: Cambiar la contraseña con el token
router.post("/resetear", (req, res) => {
  const { token, nuevaPassword } = req.body;

  if (usedTokens.has(token)) {
    return res.status(400).json({ error: "Este enlace ya fue utilizado." });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email;

    const hashedPassword = bcrypt.hashSync(nuevaPassword, 10);

    db.run("UPDATE usuario SET password_hash = ? WHERE email = ?", [hashedPassword, email], function (err) {
      if (err) {
        console.error("❌ Error actualizando contraseña:", err.message);
        return res.status(500).json({ error: "Error al actualizar la contraseña" });
      }

      // 🔐 Marcar token como usado
      usedTokens.add(token);

      console.log("🔐 Contraseña actualizada para:", email);
      res.json({ message: "✅ Contraseña actualizada con éxito." });
    });
  } catch (err) {
    console.error("❌ Token inválido o expirado:", err.message);
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});


module.exports = router;
