const express = require("express");
const app = express();
const db = require("./src/models")
require("dotenv").config();

app.use(express.json({}));

const PORT = process.env.PORT;
// Routes
app.get("/", (req, res) => {
  res.json({ pesan: "Welcome" });
});
const autRoutes = require("./src/routes/authRouter");
app.use('/auth', autRoutes);

// Testing models
// const dbTest = require("./src/models");
// console.log("Available Models:", Object.keys(dbTest));
// console.log("Order Model:", dbTest.Order);
// console.log("OrderItem Model:", dbTest.OrderItem);



app.listen(PORT, () => console.log("Server is Running"));
