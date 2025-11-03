const { Op } = require("sequelize");
const {
  sequelize,
  User,
  Shipment,
  Order,
  OrderItem,
  Book,
  Address,
} = require("../models");
const { sendEmail } = require("../utils/emailServices");

// Buat order ( user )✔️👏
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id_user;
    const { items, address_id } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Item is NULL",
      });
    }

    if (!address_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Address is Required!!",
      });
    }

    const address = await Address.findOne({
      where: { id_address: address_id, user_id: userId },
    });

    if (!address) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Address Not Found",
      });
    }

    let totalCents = 0;
    const orderItemData = [];

    for (const item of items) {
      const { book_id, quantity } = item;

      if (!book_id || !quantity || quantity < 1) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid item data",
        });
      }

      const book = await Book.findByPk(book_id, { transaction });

      if (!book) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Book with id ${book_id} NOT FOUND`,
        });
      }

      if (book.stock < quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficent stock for ${book.title}. Available ${book.stock}. Requested ${quantity}`,
        });
      }

      const itemTotal = book.price_cents * quantity;
      totalCents += itemTotal;

      orderItemData.push({
        book_id: book.id_book,
        price_cent: book.price_cents,
        quantity,
        book,
      });
    }

    const newOrder = await Order.create(
      {
        user_id: userId,
        total_cents: totalCents,
        status: "pending",
      },
      { transaction }
    );

    for (const itemData of orderItemData) {
      await OrderItem.create(
        {
          order_id: newOrder.id_order,
          book_id: itemData.book_id,
          price_cent: itemData.price_cent,
          quantity: itemData.quantity,
        },
        { transaction }
      );

      //Update book stock
      await itemData.book.decrement("stock", {
        by: itemData.quantity,
        transaction,
      });
    }


    // create shipment recod
    await Shipment.create(
      {
        address_id: address_id,
        order_id : newOrder.id_order,
        status: "processing",
      },
      { transaction }
    );
    await transaction.commit();

    const completeOrder = await Order.findByPk(newOrder.id_order, {
      include: [
        {
          model: OrderItem,
          as : "orderItems",
          include: [
            {
              model: Book,
              as: "book",
              attributes: ["id_book", "title", "author", "cover_path"],
            },
          ],
        },
      ],
    });

    const user = await User.findByPk(userId);

    const emailData = {
      full_name : user.username,
      address : `${address.street}, ${address.provinces}, ${address.postal_code}`,
      items : completeOrder.orderItems.map((item) => ({
        title : item.book.title,
        // price_cents : item.book.price_cents,
      })),
      total_price : completeOrder.total_cents,
    };

    await sendEmail(
      user.email,
      "Terimakasih Telah Berbelanja Selamat Menikmati Keseruannya",
      "OrderEmail",
      emailData
    )

    return res.status(201).json({
      success: true,
      message: "Order succesful",
      data: completeOrder,
    });
  } catch (error) {
    if(!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Create Order ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// cek order ( user ) ✔️👏
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { page = 1, limit = 10, status } = req.query;

    const where = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: OrderItem,
          as: "orderItems",
          include : [
            {
              model : Book,
              as : "book",
              paranoid : false,
              attributes: ["id_book", "title", "author", "cover_path"],
            }
          ]
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / parseInt(limit)),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get My Orders ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server ERROR",
      error: error.message,
    });
  }
};

// Cek Order by id (User) ✔️👏
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;
    const userRole = req.user.role;

    const where = { id_order: id };
    if (userRole !== "admin") {
      where.user_id = userId;
    }

    const order = await Order.findOne({
      where,
      include: [
        {
          model: OrderItem,
          as : "orderItems",
          include: [
            {
              model: Book,
              as: "book",
              paranoid : false,
              attributes: [
                "id_book",
                "title",
                "author",
                "cover_path",
                "price_cents",
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id_user", "username", "email"],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order NOT FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order By Id ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server ERROR",
      error: error.message,
    });
  }
};

// Cek semua order ( Admin )✔️👏
exports.getAllOrders = async (req, res) =>{
  try {
    const { page = 1, limit = 20, status, user_id, startDate, endDate} = req.query

    const where = {};
    if( status ) where.status = status;
    if(user_id) where.user_id = user_id;

    if( startDate || endDate){
      where.createdAt = {};
      if(startDate) where.createdAt[Op.gte] = new Date(startDate);
      if(endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows : orders } = await Order.findAndCountAll({
      where,
      limit : parseInt(limit),
      offset,
      order : [["createdAt", "DESC"]],
      include : [
        {
          model : User,
          as : "user",
          attributes : ["id_user", "username", "email"],
        },
        {
          model : OrderItem,
          as : "orderItems",
          include : [
            {
              model : Book,
              as : "book",
              attributes : ["id_book", "title", "author"],
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      data : {
        orders,
        pagination : {
          currentPage : parseInt(page),
          totalPages : Math.ceil(count / parseInt(limit)),
          totalItems : count,
          itemsPerPage : parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get ALL Order ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};

// Update Status Order ( Admin ) ✔️👏
exports.updateOrderStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const { status } = req.body;


    const validStatuses = ["paid", "pending", "canceled"];
    if (!status || !validStatuses.includes(status)){
      return res.status(400).json({
        success : false,
        message : `Invalid Status. Status Valid : ${validStatuses.join(", ")}`,
      })
    }

    const order = await Order.findByPk(id);
    if(!order) {
      return res.status(404).json({
        success : false,
        message : "Order Not Found",
      });
    }

    await order.update({ status });

    return res.status(200).json({
      success : true,
      message : "Update status order succesful",
      data : order,
    });
  } catch (error) {
    console.error("Update Orders Status ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
}

// Cancel Order by User✔️👏
exports.cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    const order = await Order.findOne({
      where : { id_order : id, user_id : userId},
      include :  [
        {
          model : OrderItem,
          as : "orderItems",
          include : ["book"],
        },
      ],
      transaction,
    });

    if(!order) {
      return res.status(404).json({
        success : false,
        message : "Order NOT FOUND",
      });
    }

    // hanya cancel ketika proses pending or paid
    if(!["pending", "paid"].includes(order.status)){
      await transaction.rollback();
      return res.status(400).json({
        success : false,
        message : "Cannot cancel because already processing, or shipped, or delivered",
      });
    }

    // Return stock
    for ( const item of order.orderItems){
      await item.book.increment("stock", {
        by : item.quantity,
        transaction,
      });
    }

    //Update Order Status
    await Order.update(
      { status : "canceled"},
      {where : {id_order : order.id_order},
      transaction});

      // Update Shipment status
      await Shipment.update(
        { status : "canceled"},
        { where : {order_id : order.id_order},
        transaction}
      );

    await transaction.commit();
    return res.status(200).json({
      success : true,
      message : "Order canceled Succes",
      data : order,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Cancel Order ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};

// Get Order Stastic(admin)✔️👏
exports.getOrderStatistic = async (req, res) => {
  try {
    const { startDate, endDate} = req.query;

    // filter 
    const where = {};
    if( startDate || endDate){
      where.createdAt = {};
      if(startDate) where.createdAt[Op.gte] = new Date(startDate);
      if(endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Count order by status
    const orderByStatus = await Order.findAll({
      where,
      attributes : [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id_order")), "count"],
        [sequelize.fn("SUM", sequelize.col("total_cents")), "total_revenue"],
      ],
      group : ["status"],
      raw : true,
    });

    const totalOrders = await Order.count( { where } );

    // Total revenue
    const revenueData = await Order.findOne( {
      where : {
        ...where,
        status :{[Op.in] :["paid", "pending", "canceled"]},
      },
      attributes : [
        [sequelize.fn("SUM", sequelize.col("total_cents")), "total_revenue"],
      ],
      raw : true,
    });

    const recentOrders = await Order.findAll({
      where,
      limit : 10,
      order : [["createdAt", "DESC"]],
      include : [
        {
          model : User,
          as : "user",
          attributes : ["username", "email"],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      data : {
        totalOrders,
        totalRevenue : revenueData.total_revenue || 0,
        orderByStatus,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Get Order Statistic ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};