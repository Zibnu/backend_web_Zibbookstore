'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      id : {
    type : Sequelize.UUID,
    defaultValue : Sequelize.UUIDV4,
    primaryKey : true,
  },
  username : {
    type : Sequelize.STRING( 50),
    allowNull: false,
    unique : true
  },
  email : {
    type : Sequelize.STRING(100),
    allowNull : false,
    unique : true
  },
  password_hash : {
    type : Sequelize.TEXT,
    allowNull : false
  },
  isActive : {
    type : Sequelize.BOOLEAN,
    defaultValue : true
  },
  created_at : {
    type : Sequelize.DATE ,
    defaultValue: Sequelize.NOW
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("user")
  }
};
