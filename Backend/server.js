require("dotenv").config();
const app = require("./app");
const db = require("./database/db");

const port = process.env.APP_PORT || 3000;

// test DB connection using pool safely
db.getConnection((err, connection) => {
  if (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }

  if (connection) connection.release();

  console.log("DB connected");

  app.listen(port, () => {
    console.log(`Backend running on ${port}`);
  });
});
