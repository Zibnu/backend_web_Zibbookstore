const { DataTypes } = require("sequelize")
const sequelize = require("../config/db")
const User = require("./User")
const Book = require("./Book")

const Review = sequelize.define("Review", {
  id : {
    type : DataTypes.UUID,
    primaryKey : true,
    defaultValue : DataTypes.UUIDV4
  },
  user_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : User,
      key : "id",
    },
  },
  book_id : {
    type : DataTypes.UUID,
    allowNull : false,
    references : {
      model : Book,
      key : "id",
    },
  },
  rating : {
    type : DataTypes.INTEGER,
    allowNull : false,
  },
  Comment : {
    type : DataTypes.TEXT,
  },
}, {
  tableName : "reviews",
  timestamps : false
}
)
// Relasi 
Review.belongsTo(User, {foreignKey : "id"}),
Review.belongsTo(Book, {foreignKey : "id"})
module.exports = Review