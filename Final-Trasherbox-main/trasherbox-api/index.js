const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Conexión a SQLite
const db = new sqlite3.Database("./trasherbox.db", (err) => {
  if (err) {
    console.error("❌ Error conectando a SQLite:", err.message);
  } else {
    console.log("✅ Conectado a trasherbox.db");
  }
});

// Simulación en memoria para tokens de recuperación
const resetTokens = {};

// Configuración de Nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tucorreo@gmail.com",         // ← Cambia por tu correo
    pass: "tu_app_password_segura",     // ← Aquí va tu App Password
  },
});

// Middleware de verificación de admin
function verifyAdmin(req, res, next) {
  const email = req.body.adminEmail || req.query.adminEmail;
  if (!email) return res.status(400).json({ error: "Falta adminEmail" });

  db.get("SELECT rol FROM usuario WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(403).json({ error: "Acceso denegado" });
    if (row.rol !== "admin") return res.status(403).json({ error: "Solo administradores" });
    next();
  });
}

// Registro de usuario
app.post("/api/register", async (req, res) => {
  const { email, password, usuario, telefono } = req.body;
  if (!email || !password || !usuario || !telefono) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO usuario (email, password_hash, usuario, telefono) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, usuario, telefono],
      function (err) {
        if (err) {
          console.error("Error al registrar:", err.message);
          return res.status(400).json({ error: "Usuario ya existe o error al registrar" });
        }
        res.status(200).json({ success: true, userId: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Error del servidor" });
  }
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM usuario WHERE email = ?`, [email], async (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Credenciales incorrectas" });

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return res.status(401).json({ error: "Credenciales incorrectas" });

    res.json({
      success: true,
      user: {
        id: row.id,
        email: row.email,
        usuario: row.usuario,
        rol: row.rol,
      },
    });
  });
});

// Recuperar contraseña
app.post("/api/recuperar-password", (req, res) => {
  const { email } = req.body;

  db.get("SELECT * FROM usuario WHERE email = ?", [email], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Correo no registrado" });

    const token = crypto.randomBytes(20).toString("hex");
    resetTokens[token] = email;

    const resetUrl = `http://localhost:5173/resetear/${token}`;
    const html = `
      <p>Hola ${row.usuario},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    transporter.sendMail(
      {
        from: "tucorreo@gmail.com",
        to: email,
        subject: "Recuperar contraseña - TrasherBox",
        html,
      },
      (error, info) => {
        if (error) {
          console.error("Error al enviar correo:", error);
          return res.status(500).json({ error: "Error al enviar correo" });
        }
        res.json({ message: "Correo enviado. Revisa tu bandeja de entrada." });
      }
    );
  });
});

// Resetear contraseña
app.post("/api/resetear-password", async (req, res) => {
  const { token, nuevaPassword } = req.body;
  const email = resetTokens[token];
  if (!email) return res.status(400).json({ error: "Token inválido o expirado" });

  const hash = await bcrypt.hash(nuevaPassword, 10);
  db.run("UPDATE usuario SET password_hash = ? WHERE email = ?", [hash, email], (err) => {
    if (err) return res.status(500).json({ error: "Error al actualizar contraseña" });
    delete resetTokens[token];
    res.json({ message: "Contraseña actualizada con éxito" });
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 API TrasherBox corriendo en http://localhost:${PORT}`);
});
