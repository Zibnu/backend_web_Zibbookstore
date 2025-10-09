'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("carts", {
      id_cart: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id_user",
        },
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "books",
          key: "id_book",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 1,
      },
      createdAt : {
      type : Sequelize.DATE,
      allowNull : false
    },
    updatedAt : {
      type : Sequelize.DATE,
      allowNull : false,
    },
    deletedAt : {
      type : Sequelize.DATE,
      allowNull : true
    }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("carts")
  }
};
