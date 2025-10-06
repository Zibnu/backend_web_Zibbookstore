const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// User route
router.post("/create", authenticate, orderControllers.createOrder);
router.get("/my-orders", authenticate, orderControllers.getMyOrders);
router.get("/:id", authenticate, orderControllers.getOrderById);
router.post("/:id/canceled", authenticate, orderControllers.cancelOrder);

// Admin Route
router.get("/admin/all", authenticate, isAdmin, orderControllers.getAllOrders);
router.get("/admin/statistic", authenticate, isAdmin, orderControllers.getOrderStatistic);
router.patch("/:id/status", authenticate, isAdmin, orderControllers.updateOrderStatus);

module.exports = router;