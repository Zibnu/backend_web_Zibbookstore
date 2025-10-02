'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("address", {
      id_address: {
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
    full_name: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    street: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    postal_code: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    provinces: {
      type: Sequelize.STRING(100),
      allowNull: false,
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
    await queryInterface.dropTable("address")
  }
};
