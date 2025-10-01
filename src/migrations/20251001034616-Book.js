'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("books", {
      id_book : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true,
  },
  title : {
    type : Sequelize.STRING(150),
    allowNull : false
  },
  author : {
    type : Sequelize.STRING(200),
    allowNull : false,
  },
  description : {
    type : Sequelize.TEXT
  },
  category_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "categories",
      key : "id_category"
    },
  },
  price_cents : { 
    type : Sequelize.INTEGER,
    allowNull : false
  },
  stock : {
    type : Sequelize.INTEGER,
    defaultValue : 0,
  },
  cover_path : {
    type : Sequelize.TEXT,
    allowNull : false,
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("books")
  }
};
