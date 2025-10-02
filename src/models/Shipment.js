module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    "Shipment",
    {
      id_shipment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "address",
          key: "id_address",
        },
        order_id : {
          type : DataTypes.INTEGER,
          allowNull : false,
          references : {
            model : "orders",
            key : "id_order"
          }
        }
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "processing",
        validate: {
          isIn: [["processing", "shipped", "delivery", "canceled"]],
        },
      },
    },
    {
      modelName : "Shipment",
      tableName: "shipments",
      timestamps: true,
      paranoid: true,
    }
  );
  Shipment.associate = (models) => {
    Shipment.belongsTo(models.Address, { foreignKey: "address_id", as: "address" });
    Shipment.belongsTo(models.Order, {foreignKey : "order_id", as : "order"})
  };
  return Shipment;
};
