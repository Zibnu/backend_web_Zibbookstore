require('dotenv').config()

module.exports = {
  development : {
    // username : process.env.DB_USER,
    // password : process.env.DB_PASS,
    // database : process.env.DB_NAME,
    // host : process.env.DB_HOST,
    use_env_variable : "DB_URL",
    dialect : process.env.DB_DIALECT,
    // migrationStorageTableName : "migration",
    // migrationStorage : "sequelize",
    // migrations : {
    //   path : "src/migrations",
    //   pattern : /\.js$/,
    // },
    // seederStorage : "sequelize",
    // seederStorageTableName : "seeders",
  },
  test : {
    // username : process.env.DB_USER,
    // password : process.env.DB_PASS,
    // database : process.env.DB_NAME,
    // host : process.env.DB_HOST,
    use_env_variable : "DB_URL",
    dialect : process.env.DB_DIALECT
  },
  production : {
    // username : process.env.DB_USER,
    // password : process.env.DB_PASS,
    // database : process.env.DB_NAME,
    // host : process.env.DB_HOST,
    use_env_variable : "DB_URL",
    dialect : process.env.DB_DIALECT,
  }
}