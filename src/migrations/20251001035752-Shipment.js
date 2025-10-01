'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("shipments", {
      id_shipment: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    addres_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "address",
        key: "id_addres",
      },
    },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: "processing",
      validate: {
        isIn: [["processing", "shipped", "delivery", "canceled"]],
      },
    },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("shipments")
  }
};
