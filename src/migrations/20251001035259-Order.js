'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id_order : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement: true,
  },
  user_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "user",
      key : "id_user"
    }
  },
  total_cents : {
    type : Sequelize.INTEGER,
    allowNull : false
  },
  status : {
    type : Sequelize.STRING(20),
    defaultValue : 'paid',
    validate : {
      isIn : [["pending", "paid", "canceled" ]]
    }
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("orders")
  }
};
