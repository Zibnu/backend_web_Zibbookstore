'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      id_review : {
    type : Sequelize.INTEGER,
    primaryKey : true,
    autoIncrement: true,
  },
  user_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "user",
      key : "id_user",
    },
  },
  book_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "books",
      key : "id_book",
    },
  },
  rating : {
    type : Sequelize.INTEGER,
    allowNull : false,
  },
  Comment : {
    type : Sequelize.TEXT,
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("reviews")
  }
};
