// trasherbox-api/db/connection.js
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "trasherbox.db");

const dbPromise = open({
  filename: dbPath,
  driver: sqlite3.Database,
});

export default dbPromise;
