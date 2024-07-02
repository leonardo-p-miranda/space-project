const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config.js');

let db;

if (process.env.NODE_ENV === 'test') {
  db = new sqlite3.Database(':memory:');
} else {
  db = mysql.createPool(config.db);
}

async function query(sql, params) {
  if (process.env.NODE_ENV === 'test') {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  } else {
    const connection = await db.getConnection();
    const [results, _] = await connection.execute(sql, params);
    connection.release();
    return results;
  }
}

const close = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      db.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      db.end(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
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
