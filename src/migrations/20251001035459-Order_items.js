'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("order_items", {
      id_order : {
    type: Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement : true,
  },
  order_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "orders",
      key : "id_order",
    }
  },
  book_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "books",
      key : "id_book"
    }
  },
  price_cent : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  quantity : {
    type : Sequelize.INTEGER,
    allowNull : false,
    defaultValue : 1
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("order_items")
  }
};
