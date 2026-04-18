const logger = require("./logger");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const userRouter = require("./users/user.router");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRouter);

const con = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PWD || "",
  database: process.env.MYSQL_DB,
});

// connect to database only if not in test environment
if (process.env.NODE_ENV !== "test") {
  con.connect(function (err) {
    if (err) {
      console.error("Database connection failed:", err.message);
      return;
    }

    console.log("Connected to MySQL");

    // Create database
    con.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB}\``,
      function (err) {
        if (err) {
          console.error("Error creating database:", err.message);
        }
      },
    );

    // Doctor table
    let stmt = `
    CREATE TABLE IF NOT EXISTS \`${process.env.MYSQL_DB}\`.\`user_doctor\` (
      id INT NOT NULL AUTO_INCREMENT,
      firstname VARCHAR(45) NOT NULL,
      lastname VARCHAR(45) NULL,
      email VARCHAR(45) NOT NULL,
      password VARCHAR(100) NOT NULL,
      namespace_id VARCHAR(45) NOT NULL,
      specialization ENUM ('Cardiologist','Dermatologist','General Medicine (MD)','Dentist','Gynecologist','Neurologist','Physiotherapist','Orthopedic') NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX namespace_id_UNIQUE (namespace_id ASC),
      UNIQUE INDEX email_UNIQUE (email ASC)
    )`;

    con.query(stmt, function (err) {
      if (err) console.error(err.message);
    });

    // Patient table
    stmt = `
    CREATE TABLE IF NOT EXISTS \`${process.env.MYSQL_DB}\`.\`user_patient\` (
      id INT NOT NULL AUTO_INCREMENT,
      firstname VARCHAR(45) NOT NULL,
      lastname VARCHAR(45) NULL,
      email VARCHAR(45) NOT NULL,
      password VARCHAR(100) NOT NULL,
      PRIMARY KEY (id),
      UNIQUE INDEX email_UNIQUE (email ASC)
    )`;

    con.query(stmt, function (err) {
      if (err) console.error(err.message);
    });

    // Pending calls table
    stmt = `
    CREATE TABLE IF NOT EXISTS \`${process.env.MYSQL_DB}\`.\`pending_calls\` (
      id INT NOT NULL AUTO_INCREMENT,
      roomid VARCHAR(45) NOT NULL,
      doctor_id INT NOT NULL,
      patient_id INT NOT NULL,
      PRIMARY KEY (id),
      CONSTRAINT fk_doctor_id
        FOREIGN KEY (doctor_id)
        REFERENCES \`${process.env.MYSQL_DB}\`.\`user_doctor\` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT fk_patient_id
        FOREIGN KEY (patient_id)
        REFERENCES \`${process.env.MYSQL_DB}\`.\`user_patient\` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;

    con.query(stmt, function (err) {
      if (err) console.error(err.message);
    });

    // Prescription table
    stmt = `
    CREATE TABLE IF NOT EXISTS \`${process.env.MYSQL_DB}\`.\`prescription\` (
      id INT NOT NULL AUTO_INCREMENT,
      details TEXT,
      doctor_id INT NOT NULL,
      patient_id INT NOT NULL,
      PRIMARY KEY (id),
      CONSTRAINT fk_prescription_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES \`${process.env.MYSQL_DB}\`.\`user_doctor\` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      CONSTRAINT fk_prescription_patient
        FOREIGN KEY (patient_id)
        REFERENCES \`${process.env.MYSQL_DB}\`.\`user_patient\` (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    )`;

    con.query(stmt, function (err) {
      if (err) console.error(err.message);
    });
  });
}

const port = process.env.APP_PORT || 3000;

app.listen(port, () => {
  console.log(`Backend up and running on PORT : ${port}`);
});

module.exports = app;
