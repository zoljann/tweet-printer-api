const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  name: String,
  mobileNumber: Number,
  items: String,
});
const Order = mongoose.model("Order", orderSchema);

router.get("/get-orders", function (req, res) {
  res.json({ id: 1, product: "Product 1", quantity: 5 });
});

router.post("/create-order", function (req, res) {
  const newOrder = new Order({
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    items: req.body.items,
  });

  console.log(newOrder); //spasi u bazu
});

module.exports = router;
