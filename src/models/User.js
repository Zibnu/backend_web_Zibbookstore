const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Addres = require('./Addres.Js')

const User = sequelize.define("User", {
  id : {
    type : DataTypes.UUID,
    defaultValue : DataTypes.UUIDV4,
    primaryKey : true,
  },
  username : {type : DataTypes.STRING( 50), allowNull: false, unique : true},
  email : {type : DataTypes.STRING(100), allowNull : false, unique : true},
  password_hash : {type : DataTypes.TEXT, allowNull : false},
  isActive : {type : DataTypes.BOOLEAN, defaultValue : true},
  created_at : {type : DataTypes.DATE , defaultValue: DataTypes.NOW},
},
{
  tableName : "users",
  timestamps : false,
}
)
User.hasMany(Addres, {foreignKey : "user_id"})

module.exports = User