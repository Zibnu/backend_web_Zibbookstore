module.exports = (sequelize, DataTypes) => {
  const Shipment = sequelize.define(
    "Shipment",
    {
      id_shipment: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      addres_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "addres",
          key: "id_address",
        },
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
    Shipment.belongsTo(models.Address, { foreignKey: "id_addres", as: "addres" });
  };
  return Shipment;
};
