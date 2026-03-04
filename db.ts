import { Database } from "bun:sqlite";

const dbFile = process.env.DB_FILE || "database.sqlite";

export const db = new Database(dbFile);

/* =========================
   INIT TABLE
========================= */

export const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  // Seed jika kosong
  const count = db.query("SELECT COUNT(*) as total FROM users").get() as { total: number };

  if (count.total === 0) {
    db.exec(`
      INSERT INTO users (name, role) VALUES
      ('Leo', 'Admin'),
      ('Budi', 'User'),
      ('Sinta', 'Editor');
    `);
  }

  console.log("✅ SQLite initialized");
};