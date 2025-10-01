'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id_category : {
          type : Sequelize.INTEGER,
          primaryKey : true,
          autoIncrement : true,
        },
        name_category : {
          type : Sequelize.STRING(100),
          allowNull : false
        }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("categories")
  }
};
