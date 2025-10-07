const express = require('express');
const router = express.Router();
const paymentControllers = require("../controllers/paymentControllers");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Route User
router.post("/create", authenticate, paymentControllers.createPayment);

// Route admin
router.get("/admin/log_payment", authenticate, isAdmin, paymentControllers.getAllPayment);
router.get("/admin/:id", authenticate, isAdmin, paymentControllers.getPaymentById);
router.delete("/admin/delete/:id", authenticate, isAdmin, paymentControllers.deletePayment);
module.exports = router