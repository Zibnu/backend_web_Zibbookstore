'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("payments",{
      id_payment: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id_order",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id_user",
        },
      },
      payment_method: {
        type: Sequelize.ENUM("Dana", "Gopay", "Ovo"),
        allowNull : false,
      },
      total_cents: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status : {
        type : Sequelize.ENUM("success", "failed", "pending"),
        allowNull : false,
        defaultValue : "pending",
      },
      payment_date : {
        type : Sequelize.DATE,
        defaultValue : Sequelize.NOW,
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("payments")
  }
};
