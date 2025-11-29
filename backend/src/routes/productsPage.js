const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { getProducts, getProductById } = require("../controllers/productPage");
const { searchProducts } = require("../controllers/homeProducts.controller");

// Routes
router.get( "/category/:category", getProducts);
router.get("/product/:id", getProductById);
router.post("/search", searchProducts);

module.exports = router;
