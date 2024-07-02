const mysql = require("mysql2/promise");
const sqlite3 = require('sqlite3').verbose();
const config = require("../config.js");

let db;

if (process.env.NODE_ENV === 'test') {
  db = new sqlite3.Database(':memory:');
  db.serialize(() => {
    db.run(`CREATE TABLE pilot (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, experience INTEGER, origin TEXT)`);
    db.run(`CREATE TABLE contract (id TEXT PRIMARY KEY, description TEXT, origin_planet TEXT, destination_planet TEXT, value INTEGER, payload TEXT, status TEXT)`);
    db.run(`CREATE TABLE ship (id INTEGER PRIMARY KEY AUTOINCREMENT, fuel_capacity INTEGER, fuel_level INTEGER, weight_capacity INTEGER, pilot_id INTEGER, FOREIGN KEY (pilot_id) REFERENCES pilot (id))`);
  });
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
    const [results, _] = await db.execute(sql, params);
    return results;
  }
}

module.exports = { query };
