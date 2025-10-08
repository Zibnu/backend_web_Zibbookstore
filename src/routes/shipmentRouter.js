const express = require("express");
const router = express.Router();
const shipmentControllers = require("../controllers/shipmentControllers");
const { authenticate, isAdmin } = require("../middleware/authMiddleware");

// Route User
router.get("/log-order/:order_id", authenticate, shipmentControllers.getShipmentByOrder);

// Route Admin
router.get("/log-shipment", authenticate, isAdmin, shipmentControllers.getAllShipment);
router.put("/update/:id", authenticate, isAdmin, shipmentControllers.updateShipment);
module.exports = router