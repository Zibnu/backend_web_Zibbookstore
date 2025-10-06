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
    address_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "address",
        key: "id_address",
      },
    },
    order_id : {
          type : Sequelize.INTEGER,
          allowNull : false,
          references : {
            model : "orders",
            key : "id_order"
          }
        },
    status: {
      type: Sequelize.STRING(20),
      defaultValue: "processing",
      validate: {
        isIn: [["processing", "shipped", "delivery", "canceled"]],
      },
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
    await queryInterface.dropTable("shipments")
  }
};
