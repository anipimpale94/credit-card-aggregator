const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'creditcard.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
});

db.configure('busyTimeout', 10000);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          plaid_account_id TEXT UNIQUE,
          access_token TEXT NOT NULL,
          name TEXT NOT NULL,
          mask TEXT,
          type TEXT,
          subtype TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL,
          plaid_transaction_id TEXT UNIQUE,
          name TEXT NOT NULL,
          amount REAL NOT NULL,
          date TEXT NOT NULL,
          category TEXT,
          type TEXT,
          pending BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES accounts(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS budgets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          category TEXT NOT NULL,
          "limit" REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};

const getDb = () => db;

module.exports = {
  db,
  getDb,
  initDatabase,
};
