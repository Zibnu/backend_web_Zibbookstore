'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("categories", {
      id : {
          type : Sequelize.INTEGER,
          defaultValue : Sequelize.UUIDV4,
          primaryKey : true,
        },
        name_category : {
          type : Sequelize.STRING(100),
          allowNull : false
        }
    })
    await queryInterface.createTable("books", {
      id : {
    type : Sequelize.UUID,
    defaultValue : Sequelize.UUIDV4,
    primaryKey : true
  },
  title : {
    type : Sequelize.STRING(150),
    allowNull : false
  },
  author : {
    type : Sequelize.STRING(200)
  },
  description : {
    type : Sequelize.TEXT
  },
  category_id : {
    type : Sequelize.INTEGER,
    allowNull : false,
    references : {
      model : "categories",
      key : "id"
    },
  },
  price_cents : { 
    type : Sequelize.INTEGER,
    allowNull : false
  },
  stock : {
    type : Sequelize.INTEGER,
    defaultValue : 0
  },
  cover_path : {
    type : Sequelize.TEXT
  },
  created_at : {
    type : Sequelize.TIME,
    defaultValue : Sequelize.NOW
  },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("categories")
    await queryInterface.dropTable("books")
  }
};
