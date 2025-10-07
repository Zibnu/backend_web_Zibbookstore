const express = require('express');
const router = express.Router();
const paymentControllers = require("../controllers/paymentControllers");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Route User
router.post("/create", authenticate, paymentControllers.createPayment);

module.exports = router