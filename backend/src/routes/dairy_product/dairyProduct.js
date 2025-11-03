const express = require("express");
const router = express.Router();
const pool = require("../../config/db");
const { sendResponse } = require("../../utils/response");
const Authorization = require("../../middleware/authorization");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/home_page_products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `prod_${timestamp}_${Math.random().toString(36).substring(2)}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}); 

// Add a new product
router.post(
  "/addproduct", 
  upload.any(), 
  async (req, res, next) => {
    try {
      console.log("Request body:", req.body.details);

        const { name, category, quantity, price, details } = req.body;

        let images = null;
      
        // Handle uploaded files
        if (req.files && req.files.length > 0) {
            const imageFilenames = req.files.map(file => file.filename);
            images = JSON.stringify(imageFilenames);
            console.log('Uploaded images:', imageFilenames);
        }

        // Insert product into database
        const [result] = await pool.query(
        `INSERT INTO home_page_products 
                (name, category, quantity, price, images, details, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
            name.trim(),
            category.trim(),
            quantity.trim(),
            price,
            images,
            details ? details.trim() : null
        ]
        );

        // Fetch inserted product
        const [newProductRows] = await pool.query(
            "SELECT * FROM home_page_products WHERE id = ?",
            [result.insertId]
        );

        if (newProductRows.length === 0) {
            return sendResponse(res, 500, false, "Failed to fetch the added product");
        }

        return sendResponse(res, 201, true, "Product added successfully", newProductRows[0]);

    } catch (error) {
        console.error("Error adding product:", error);

        // Clean up uploaded files if there was an error
        if (req.files) {
            req.files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
            });
        }

        next(error);
    }
});

// Get all dairy products
router.get(
  "/dairy", 
  async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM home_page_products WHERE category = 'dairy'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    // Convert stored JSON string to array of full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

    const formattedRows = rows.map(product => {
      let imagePaths = [];
      if (product.images) {
        try {
          const parsed = JSON.parse(product.images);
          imagePaths = parsed.map(filename => baseUrl + filename);
        } catch (err) {
          console.error("Image parse error:", err);
        }
      }

      return {
        ...product,
        imageUrls: imagePaths,
      };
    });

    return sendResponse(res, 200, true, "Home page products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
});

// Get all tobacco products
router.get(
  "/tobacco", 
  async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM home_page_products WHERE category = 'tobacco'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    // Convert stored JSON string to array of full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

    const formattedRows = rows.map(product => {
      let imagePaths = [];
      if (product.images) {
        try {
          const parsed = JSON.parse(product.images);
          imagePaths = parsed.map(filename => baseUrl + filename);
        } catch (err) {
          console.error("Image parse error:", err);
        }
      }

      return {
        ...product,
        imageUrls: imagePaths,
      };
    });

    return sendResponse(res, 200, true, "Home page products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
});

// Get all snacks products
router.get(
  "/snacks", 
  async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM home_page_products WHERE category = 'snacks'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    // Convert stored JSON string to array of full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

    const formattedRows = rows.map(product => {
      let imagePaths = [];
      if (product.images) {
        try {
          const parsed = JSON.parse(product.images);
          imagePaths = parsed.map(filename => baseUrl + filename);
        } catch (err) {
          console.error("Image parse error:", err);
        }
      }

      return {
        ...product,
        imageUrls: imagePaths,
      };
    });

    return sendResponse(res, 200, true, "Home page products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
});

// Get all cold drink products
router.get(
  "/tobacco", 
  async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM home_page_products WHERE category = 'tobacco'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    // Convert stored JSON string to array of full URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/home_page_products/`;

    const formattedRows = rows.map(product => {
      let imagePaths = [];
      if (product.images) {
        try {
          const parsed = JSON.parse(product.images);
          imagePaths = parsed.map(filename => baseUrl + filename);
        } catch (err) {
          console.error("Image parse error:", err);
        }
      }

      return {
        ...product,
        imageUrls: imagePaths,
      };
    });

    return sendResponse(res, 200, true, "Home page products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;