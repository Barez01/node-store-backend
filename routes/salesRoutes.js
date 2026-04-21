const express = require("express");
const {
  getOrders,
  getOrderItems,
  addOrder,
} = require("../controllers/salesControllers");
const router = express.Router();

router.get("/orders", getOrders);
router.get("/orders/items", getOrderItems);
router.post("/orders", addOrder);

module.exports = router;
