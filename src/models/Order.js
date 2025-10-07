module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id_order: {
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
      total_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "paid",
        validate: {
          isIn: [["pending", "paid", "canceled"]],
        },
      },
    },
    {
      modelName : "Order",
      tableName: "orders",
      timestamps: true,
      paranoid: true,
    }
  );
  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "order_id",
      as: "order_items",
    });
    Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    Order.hasMany(models.Shipment, { foreignKey : "order_id", as : "shipments"});
    Order.hasMany(models.OrderItem, { foreignKey : "order_id", as : "orderItems"});
    Order.hasOne(models.Payment, { foreignKey : "order_id", as : "payment"});
  };
  return Order;
};
