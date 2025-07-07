// trasherbox-api/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Inicializa express
const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
require("./db/connection");

// Rutas
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/productos"));
app.use("/api", require("./routes/usuarios"));
app.use("/api", require("./routes/carrito"));
app.use("/api", require("./routes/transacciones"));
app.use("/api/admin", require(path.resolve(__dirname, "./routes/admin/dashboard")));
app.use("/api/reportes", require("./routes/admin/reportes"));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API trasherbox corriendo en http://localhost:${PORT}`);
});
