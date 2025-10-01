require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGING, // for not spam query in your console
  }
);

// Testing connect
sequelize.authenticate()
  .then(() => {
    console.log("Connection to DB succes");
  })
  .catch(err => {
    console.error('Failed connect to DB', err);
  })

module.exports = sequelize;
