const pool = require("../database/db");
const { nanoid } = require("nanoid");

module.exports = {

  create: (data, callBack) => {
    const table =
      data.role === "Doctor" ? "user_doctor" : "user_patient";

    const values =
      data.role === "Doctor"
        ? [
            data.firstname,
            data.lastname,
            data.email,
            data.password,
            nanoid(16),
            data.specialization,
          ]
        : [
            data.firstname,
            data.lastname,
            data.email,
            data.password,
          ];

    const query =
      data.role === "Doctor"
        ? `INSERT INTO ${process.env.MYSQL_DB}.${table}
           (firstName, lastName, email, password, namespace_id, specialization)
           VALUES (?, ?, ?, ?, ?, ?)`
        : `INSERT INTO ${process.env.MYSQL_DB}.${table}
           (firstName, lastName, email, password)
           VALUES (?, ?, ?, ?)`;

    pool.query(query, values, (error, results) => {
      if (error) return callBack(error);
      return callBack(null, results);
    });
  },

  getUserByUserEmail: (data, callBack) => {
    const table =
      data.role === "Doctor" ? "user_doctor" : "user_patient";

    pool.query(
      `SELECT * FROM ${process.env.MYSQL_DB}.${table} WHERE email = ?`,
      [data.email],
      (error, results) => {
        if (error) return callBack(error);

        // ✅ FIX: prevent crash in CI/CD
        if (!results || results.length === 0) {
          return callBack(null, null);
        }

        return callBack(null, results[0]);
      }
    );
  },

  deleteUser: (data, callBack) => {
    const table =
      data.role === "Doctor" ? "user_doctor" : "user_patient";

    pool.query(
      `DELETE FROM ${process.env.MYSQL_DB}.${table} WHERE id = ?`,
      [data.id],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
};
