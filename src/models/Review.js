const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")
const User = require("./User")
const Book = require("./Book")

const Review = sequelize.define("Review", {
  id_review : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement: true,
  },
  user_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : User,
      key : "id_user",
    },
  },
  book_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : Book,
      key : "id_book",
    },
  },
  rating : {
    type : DataTypes.INTEGER,
    allowNull : false,
  },
  Comment : {
    type : DataTypes.TEXT,
  },
},
{
  tableName : "reviews",
  timestamps : true,
  paranoid : true
}
)
// Relasi 
Review.belongsTo(User, {foreignKey : "user_id", as : "user"} ),
Review.belongsTo(Book, {foreignKey : "book_id", as : "book"})
module.exports = Review