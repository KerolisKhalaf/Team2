const mysql = require("mysql");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.MYSQL_DB,

  connectionLimit: 10,

  // 👇 مهمين جدًا لـ Jenkins / Docker
  acquireTimeout: 10000,
  connectTimeout: 10000,
});

module.exports = pool;




// const { createPool } = require("mysql");

// const pool = createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.MYSQL_DATABASE,
//   connectionLimit: 10
// });

// module.exports = pool;
