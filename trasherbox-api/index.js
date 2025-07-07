// trasherbox-api/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Importa conexión a la base de datos (esto ejecuta la conexión)
require("./db/connection");

// Importa y registra rutas
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/productos"));
app.use("/api", require("./routes/usuarios"));
app.use("/api", require("./routes/carrito"));
app.use("/api", require("./routes/transacciones"));
app.use("/api/admin", require(path.resolve(__dirname, "./routes/admin/dashboard")));

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`🚀 API trasherbox corriendo en http://localhost:${PORT}`);
});
