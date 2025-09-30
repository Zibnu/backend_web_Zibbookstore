'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config.json")[env]; //ambil config.json sesuai env

const db = {}

// buat instance sequelize ( koneksi ke db)
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );

  // Otomatis import semua table
  fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 & //bukan hidden file
      file !== basename &&  //bukan file index.js sendiri
      file.slice(-3) === ".js" //hanya file .js
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

  // Jalankan asosiasi antar file
  Object.keys(db).forEach((modelName) => {
    if(db[modelName].associate){
      db[modelName].associate(db);
    }
  });

  // Simpan sequelize instance dan class Sequelize
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  module.exports = db