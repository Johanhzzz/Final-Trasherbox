const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Importa la conexión a DB
require("./db/connection");

// Importa rutas
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/productos"));
app.use("/api", require("./routes/usuarios"));
app.use("/api", require("./routes/carrito"));
app.use("/api", require("./routes/transacciones"));
app.use("/api", require("./routes/admin/dashboard")); // <- nueva ruta admin

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 API trasherbox corriendo en http://localhost:${PORT}`);
});

