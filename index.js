const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
require("dotenv").config();

// middleware
app.use(express.json({}));
app.use(cors({
  origin : "http://localhost:5173"
}))
app.use(express.urlencoded({ extended : true}))


app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
const autRoutes = require("./src/routes/authRouter");
const bookRoutes = require("./src/routes/bookRouter");
const categoryRoutes = require("./src/routes/categoryRouter");
const orderRoutes = require("./src/routes/orderRouter");
const paymentRoutes = require("./src/routes/paymentRouter");
const addressRoutes = require("./src/routes/addressRouter");
const shipmentRoutes = require("./src/routes/shipmentRouter");
const reviewRoutes = require("./src/routes/reviewRouter");
const userRoutes = require("./src/routes/userRouter");
const cartRoutes = require("./src/routes/cartRouter");
const revenueRouter = require("./src/routes/revenueRouter");
app.use('/api/auth', autRoutes);
app.use('/api/books', bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/order", orderRoutes); 
app.use("/api/payment", paymentRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/shipment", shipmentRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/dashboard", revenueRouter);

// Testing models
// const dbTest = require("./src/models");
// console.log("Available Models:", Object.keys(dbTest));
// console.log("Order Model:", dbTest.Order);
// console.log("OrderItem Model:", dbTest.OrderItem);

// path welcome
app.get("/", (req, res) => {
  res.json({ pesan: "Welcome" });
});


const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server is Running"));
