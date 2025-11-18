const express = require("express");
const router = express.Router();
const addressCountrollers = require("../controllers/addressControllers");
const { authenticate } = require("../middleware/authMiddleware");

// Route User
router.post("/create", authenticate, addressCountrollers.createAddress);
router.get("/user's", authenticate, addressCountrollers.getAllAddress);
router.put("/update/:id", authenticate, addressCountrollers.updateAddress);
router.delete("/delete/:id", authenticate, addressCountrollers.deleteAddress);

module.exports = router;