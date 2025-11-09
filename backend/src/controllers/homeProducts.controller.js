const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const { sendResponse } = require("../utils/response");

// Helper to format image URLs
const formatImageUrls = (req, products) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/uploads/home_page_products/`;

  return products.map((product) => {
    let imagePaths = [];
    if (product.images) {
      try {
        const parsed = JSON.parse(product.images);
        imagePaths = parsed.map((filename) => baseUrl + filename);
      } catch (err) {
        console.error("Image parse error:", err);
      }
    }

    return {
      ...product,
      imageUrls: imagePaths,
    };
  });
};

// Add New Product
const addProduct = async (req, res, next) => {
  try {
    const { name, category, quantity, price, details } = req.body;

    if (!name || !category || !quantity || !price) {
      return sendResponse(res, 400, false, "All fields are required");
    }

    let images = null;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageFilenames = req.files.map((file) => file.filename);
      images = JSON.stringify(imageFilenames);
      console.log("Uploaded images:", imageFilenames);
    }

    // Insert product
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
        details ? details.trim() : null,
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

    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }

    next(error);
  }
};

// Get all dairy products
const getDairyProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, quantity, price, images FROM home_page_products WHERE category = 'dairy'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Dairy products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
};

// Get all tobacco products
const getTobaccoProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, quantity, price, images FROM home_page_products WHERE category = 'tobacco'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Tobacco products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
};

// Get all snacks products
const getSnackProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, quantity, price, images FROM home_page_products WHERE category = 'snacks'"
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Snack products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
};

// Get specific product by id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, name, quantity, price, images, details FROM home_page_products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "Product not found");
    }

    return sendResponse(res, 200, true, "Product fetched successfully", rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getDairyProducts,
  getTobaccoProducts,
  getSnackProducts,
  getProductById
};
