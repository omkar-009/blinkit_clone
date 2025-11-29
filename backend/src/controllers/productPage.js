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

// Get all products by cayegory
const getProducts = async (req, res, next) => {
  try {
    const { category } = req.params;

    const [rows] = await pool.query(
      "SELECT id, name, quantity, price, images FROM home_page_products WHERE category = ?",
      [category]
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "No products found");
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
};

// Get specific product by id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, name, category, quantity, price, images, details FROM home_page_products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "Product not found");
    }

    const product = rows[0];
    
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/home_page_products/`;
    
    // Parse and format images
    let imageUrls = [];
    let imageFilenames = [];
    
    if (product.images) {
      try {
        imageFilenames = JSON.parse(product.images);
        imageUrls = imageFilenames.map((filename) => `${baseUrl}${filename}`);
      } catch (e) {
        console.error("Failed to parse images:", e);
        imageFilenames = [];
        imageUrls = [];
      }
    }

    // Return product with both imageUrls (for display) and images (filenames array for frontend)
    const formattedProduct = {
      id: product.id,
      name: product.name,
      category: product.category || null,
      quantity: product.quantity,
      price: product.price,
      images: imageFilenames,
      imageUrls: imageUrls,
      details: product.details,
    };

    return sendResponse(res, 200, true, "Product fetched successfully", formattedProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getProducts,
    getProductById
};