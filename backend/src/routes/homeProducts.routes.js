const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { addProduct, getDairyProducts, getTobaccoProducts, getSnackProducts, getProductById  } = require("../controllers/homeProducts.controller");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads/home_page_products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `prod_${timestamp}_${Math.random().toString(36).substring(2)}${extension}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// Routes
router.post("/addproduct", upload.any(), addProduct);

router.get("/dairy", getDairyProducts);
router.get("/tobacco", getTobaccoProducts);
router.get("/snacks", getSnackProducts);
router.get("/getproduct/:id", getProductById);

module.exports = router;
