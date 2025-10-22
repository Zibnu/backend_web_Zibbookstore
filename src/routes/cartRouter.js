const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const cartControllers = require("../controllers/cartControllers");

router.get("/myCart", authenticate, cartControllers.getCart);
router.post("/add", authenticate, cartControllers.addToCart);
router.put("/update/quantity/:id_cart", authenticate, cartControllers.updateQuantity);
router.delete("/delete/:id_cart", authenticate, cartControllers.removeFromCart);
router.delete("/clear", authenticate, cartControllers.clearCart);

module.exports = router