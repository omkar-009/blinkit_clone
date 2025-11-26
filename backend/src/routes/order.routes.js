const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/authorization");
const { createOrder, getOrderHistory, cancelOrder } = require("../controllers/order.controller");

// All order routes require authentication
router.use(Authorization);

// Create new order
router.post("/", createOrder);

// Get user's order history
router.get("/", getOrderHistory);

// Cancel order
router.put("/:orderId/cancel", cancelOrder);

module.exports = router;

