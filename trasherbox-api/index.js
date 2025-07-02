const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = new sqlite3.Database("./trasherbox.db");


// Ruta de registro de usuario
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
          return res.status(400).json({ error: "Error al registrar usuario o correo ya existe" });
        }
        res.status(200).json({ success: true, userId: this.lastID });
      }
    );
  } catch (err) {
    console.error("Error en el registro:", err.message);
    res.status(500).json({ error: "Error del servidor" });
  }
});



// Ruta de login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM usuario WHERE email = ?`, [email], async (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const valid = await bcrypt.compare(password, row.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.json({
      success: true,
      user: {
        id: row.id,
        email: row.email,
        usuario: row.usuario,
        rol: row.rol
      },
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API trasherbox corriendo en http://localhost:${PORT}`);
});
