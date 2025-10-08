const { Shipment, Address, Order, sequelize} = require("../models");
const {Op} = require("sequelize");

// Tidak perlu karena shipment otomatis dibuat di order
// exports.createShipment = async ( req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { order_id, address_id} = req.body;

//     if(!order_id || !address_id) {
//       await transaction.rollback();
//       return res.status(400).json({
//         success : false,
//         message : "Input Null",
//       });
//     }

//     const order = await Order.findByPk(order_id);
//     if(!order) {
//       return res.status(404).json({
//         success : false,
//         message : "Order Not Found",
//       });
//     }

//     const address = await Address.findByPk(address_id);
//     if(!address) {
//       return res.status(404).json({
//         success : false,
//         message : "Address Not Found",
//       });
//     }

//     const shipment = await Shipment.create(
//       {
//         order_id,
//         address_id,
//         status : "processing",
//       },
//       { transaction },
//     );

//     await transaction.commit();
//     return res.status(201).json({
//       success : true,
//       message : "Create Shipment Success",
//       data : shipment,
//     });
//   } catch (error) {
//     if(!transaction.finished) {
//       await transaction.rollback();
//     }
//     console.error("Create Shipment ERROR", error);
//     return res.status(500).json({
//       success : false,
//       message : "Internal Server ERROR",
//       error : error.message,
//     });
//   }
// };

// Admin✔️🔥
exports.getAllShipment = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, startDate, endDate} = req.query;
    const where = {};

    if(status) where.status = status;

    if(startDate || endDate) {
      where.createdAt = {};
      if(startDate) where.createdAt[Op.gte] = new Date(startDate);
      if(endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows : shipment} = await Shipment.findAndCountAll({
      where,
      limit : parseInt(limit),
      offset,
      order : [["createdAt", "DESC"]],
      include : [
        {
          model : Order,
          as : "order",
          attributes : ["id_order", "status", "total_cents", "user_id"],
        },
        {
          model : Address,
          as : "address",
          attributes : [
            "id_address",
            "full_name",
            "phone",
            "street",
            "postal_code",
            "provinces",
          ],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      data : {
        shipment,
        pagination : {
          currentPage : parseInt(page),
          totalPages : Math.ceil(count / parseInt(limit)),
          totalItems : count,
          itemPerPage : parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get ALL Shipment ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if(!status) {
      return res.status(400).json({
        success : false,
        message : "Your Input Status is Null",
      });
    }
    const validateStatus = ["processing", "shipped", "delivery", "canceled"];

    if( !validateStatus.includes(status) ){
      return res.status(400).json({
        success : false,
        message : `Invalid Status. Allowed Status : ${validateStatus}`,
      });
    }

    const shipment = await Shipment.findByPk(id);
    if(!shipment) {
      return res.status(404).json({
        success : false,
        message : "Shipment Not Found",
      });
    }

    if(["canceled", "delivery"].includes(shipment.status)) {
      return res.status(400).json({
        success : false,
        message : `Shipment with Status ${shipment.status} canot be update.`,
      });
    }

    await shipment.update({ status });

    return res.status(200).json({
      success : true,
      message : "Update Status Shipment Success",
      data : shipment,
    });
  } catch (error) {
    console.error("Update Shipment ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};

// User melihat status pengiriman✔️🔥
exports.getShipmentByOrder = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { order_id } = req.params;

    const shipment = await Shipment.findOne({
      include : [
        {
          model : Order,
          as : "order",
          where : { id_order : order_id, user_id : userId},
          attributes : ["id_order", "status", "total_cents"],
        },
        {
          model : Address,
          as : "address",
          attributes : [
            "full_name",
            "phone",
            "street",
            "postal_code",
            "provinces",
          ],
        },
      ],
    });

    if(!shipment) {
      return res.status(404).json({
        success : false,
        message : "Shipment Not Found"
      });
    }

    return res.status(200).json({
      success : true,
      data : shipment,
    });
  } catch (error) {
    console.error("Get Shipment By Order ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
