const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db/trasherbox.db", (err) => {
  if (err) console.error("❌ Error conectando a SQLite:", err.message);
  else console.log("✅ Conectado a trasherbox.db");
});

db.run(`
  CREATE TABLE IF NOT EXISTS orden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT,
    estado TEXT,
    monto INTEGER,
    fecha TEXT
  )
`);

module.exports = db;
