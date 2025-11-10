const { Payment, Sequelize } = require("../models");
const { Op, where } = require("sequelize")

exports.getYearlyRevenue = async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    const revenue = await Payment.findAll({
      attributes : [
        [Sequelize.fn("DATE_TRUNC", "month", Sequelize.col("payment_date")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("total_cents")), "total"],
      ],
      where : {
        status : "success",
        payment_date : {
          [Op.gte] : new Date(`${year}-01-01`),
          [Op.lte] : new Date(`${year}-12-31`),
        }
      },
      group :  ["month"],
      order : [[Sequelize.literal("month"), "ASC"]],
      raw : true,
    });

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // m for month , i for index, r for revenue
    const formatted = months.map((m, i) => {
      const found = revenue.find((r) => new Date(r.month).getMonth() === i);
      return {
        month : m,
        total : found ? Number(found.total) : 0
      };
    });

    return res.status(200).json({
      success : true,
      data : formatted,
    });
  } catch (error) {
    console.error("Get Yearly Revenue ERROR",error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
}