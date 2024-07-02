const sqlite3 = require('sqlite3').verbose();

let db;

if (process.env.NODE_ENV === 'test') {
  db = new sqlite3.Database(':memory:');
} else {
  // Set up your actual database connection here
  db = new sqlite3.Database('path/to/your/database.db');
}

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const close = () => {
  return new Promise((resolve, reject) => {
    db.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const initialize = async () => {
  if (process.env.NODE_ENV === 'test') {
    await query(`
      CREATE TABLE contract (
        id TEXT PRIMARY KEY,
        description TEXT,
        origin_planet TEXT,
        destination_planet TEXT,
        value INTEGER,
        payload TEXT,
        status TEXT
      )
    `);
  }
};

module.exports = { query, close, initialize };