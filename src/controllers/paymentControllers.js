const { sequelize ,Order, Shipment, OrderItem , Book, Payment, User} = require("../models");
const { Op } = require("sequelize");
// User✔️🔥
exports.createPayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user.id_user;
    const {order_id, payment_method} = req.body;

    if(!order_id || !payment_method) {
      await transaction.rollback();
      return res.status(400).json({
        succcess : false,
        message : "Order_id and Payment_method Required!!!",
      });
    }

    const allowedMethods = ["Dana", "Gopay", "Ovo"];
    if(!allowedMethods) {
      await transaction.rollback();
      res.status(400).json({
        succcess : false,
        message : `Method Payment is not Allowed, Payment Allowed : ${allowedMethods.join(", ")}`,
      });
    }

    const order = await Order.findByPk(order_id, {
      include : [
        {
          model : OrderItem,
          as : "orderItems",
          include : [
            {
              model : Book,
              as : "book",
              attributes : ["title", "price_cents"],
            },
          ],
        },
      ],
      transaction,
    });

    if(!order) {
      await transaction.rollback();
      return res.status(404).json({
        success : false,
        message : "Order Not Found!!"
      });
    }

    if(order.status !== "pending"){
      return res.status(400).json({
        success : false,
        message : "Book has paid or processing",
      });
    }

    const total_cents = order.total_cents;

    const payment = await Payment.create(
      {
        order_id,
        user_id : userId,
        payment_method,
        total_cents,
        status : "success",
        payment_date : new Date(),
      },
      { transaction }
    );

    await order.update({ status : "paid"}, {transaction});

    await transaction.commit();

    res.status(201).json({
      success : true,
      message : "Book has been paid",
      data : {
        payment,
        order,
      },
    });
  } catch (error) {
    if(!transaction.finished) await transaction.rollback();
    console.error("Create Payment Error", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// Admin✔️🔥
exports.getAllPayment = async (req,res) => {
  try {
    const payments = await Payment.findAll({
      include : [
        {
          model : Order,
          as : "order",
          include : [
            {
              model : User,
              as : "user",
              attributes : ["username", "email"],
            },
          ],
        },
      ],
      order : [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success : true,
      message : "Success Get Payment Data",
      data : payments
    })
  } catch (error) {
    console.error("Get ALl Payment ERROR", error);
    return res.status(500).json({
      succcess : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};

// Get Payment by Id✔️🔥
exports.getPaymentById = async (req,res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include : [
        {
          model : Order,
          as : "order",
          include : [
            {
              model : OrderItem,
              as : "orderItems",
              include : [
                {
                  model : Book,
                  as : "book"
                },
              ],
            },
          ],
        },
      ],
    });

    if(!payment) {
      return res.status(404).json({
        success : false,
        message : "Payment Not Found"
      });
    }

    return res.status(200).json({
      succcess : true,
      message : "Data Payment load ....",
      data : payment
    })
  } catch (error) {
    console.error("Get Payment By Id ERROR", error);
    return res.status(500).json({
      succcess : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};

exports.deletePayment = async ( req, res ) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if(!payment) {
      return res.status(404).json({
        succcess : false,
        message : "Payment Not Found",
      });
    }

    await payment.destroy();

    return res.status(200).json({
      succcess : true,
      message : "Payment has been Delete",
    });
  } catch (error) {
    console.error("Delete Payment ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};