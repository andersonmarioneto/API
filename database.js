const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE funcionario (id INTEGER PRIMARY KEY, nome TEXT, cargo TEXT, salario REAL)");
    db.run("CREATE TABLE crianca (id INTEGER PRIMARY KEY, nome TEXT, idade INTEGER, historico TEXT)");
});

module.exports = db;
