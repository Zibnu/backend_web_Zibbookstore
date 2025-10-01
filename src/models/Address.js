module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
  "Address",
  {
    id_addres: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id_user",
      },
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    street: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    provinces: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    modelName : "Address",
    tableName: "addres",
    timestamps: true,
    paranoid : true
  }
);
Address.associate = (models) => {
  Address.belongsTo(models.User, { foreignKey: "user_id", as : "user" });
  Address.hasMany(models.Shipment, { foreignKey : "id_shipment", as : "shipment"})
};

  return Address;
}