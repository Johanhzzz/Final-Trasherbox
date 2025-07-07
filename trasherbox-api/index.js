const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001;

const db = require("./db/connection");

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/productos"));
app.use("/api", require("./routes/usuarios"));
app.use("/api", require("./routes/carrito")); // si tienes carrito

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API trasherbox corriendo en http://localhost:${PORT}`);
});
