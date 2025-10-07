module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id_payment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "id_order",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id_user",
        },
      },
      payment_method: {
        type: DataTypes.ENUM("Dana", "Gopay", "Ovo"),
        allowNull : false,
      },
      total_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status : {
        type : DataTypes.ENUM("success", "failed", "pending"),
        allowNull : false,
        defaultValue : "pending",
      },
      payment_date : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
      },
    },
    {
      modelName : "Payment",
      tableName: "payments",
      timestamps: true,
      paranoid: true,
    }
  );
  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, {
      foreignKey : "order_id",
      as : "order",
    });
    Payment.belongsTo(models.User, {
      foreignKey : "user_id",
      as : "user",
    });
  };
  return Payment;
};
