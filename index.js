const express = require("express");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");
const app = express();

dotenv.config();
const PORT = process.env.PORT;

// defin Config DB
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_host = process.env.DB_HOSE;

// Sequelize connec to DB
const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "postgres",
});

// Testing connect
// sequelize.authenticate()
//   .then(() => {
//     console.log("Connection to DB succes");
//   })
//   .catch(err => {
//     console.error('Failed connect to DB', err);
//   })

app.get("/", (req, res) => {
  res.json({ pesan: "Welcome" });
});

app.listen(PORT, () => console.log("Server is Running"));
