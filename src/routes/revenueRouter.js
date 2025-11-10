const express = require("express");
const router = express.Router();
const { authenticate, isAdmin} = require("../middleware/authMiddleware");
const revenueControllers = require("../controllers/revenueControllers");

router.get("/revenue", authenticate, isAdmin, revenueControllers.getYearlyRevenue);

module.exports = router