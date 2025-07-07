const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./trasherbox.db", (err) => {
  if (err) {
    console.error("❌ Error conectando a SQLite:", err.message);
  } else {
    console.log("✅ Conectado a trasherbox.db");
  }
});

module.exports = db;
