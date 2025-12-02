require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_URL,
  {
    dialect: process.env.DB_DIALECT,
    logging: process.env.DB_LOGING, // for not spam query in your console
  }
);

// Testing connect
sequelize.authenticate()
  .then(() => {
    console.log("Connection to Railway Postgre success");
  })
  .catch(err => {
    console.error('Failed connect to DB', err);
  })

module.exports = sequelize;
