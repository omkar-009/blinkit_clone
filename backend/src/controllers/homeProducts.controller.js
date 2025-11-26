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
      "SELECT id, name, category, quantity, price, images, details FROM home_page_products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "Product not found");
    }

    const product = rows[0];
    
    // Debug: Log the raw product data from database
    console.log("Raw product from database:", product);
    console.log("Category from database:", product.category);
    console.log("Category type:", typeof product.category);
    
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

    // Ensure category is always included, even if NULL
    // Return product with both imageUrls (for display) and images (filenames array for frontend)
    const formattedProduct = {
      id: product.id,
      name: product.name,
      category: product.category || null, // Explicitly include category, even if NULL
      quantity: product.quantity,
      price: product.price,
      images: imageFilenames, // Array of filenames
      imageUrls: imageUrls, // Array of full URLs
      details: product.details,
    };
    
    console.log("Formatted product being sent:", formattedProduct);
    console.log("Formatted product category:", formattedProduct.category);

    return sendResponse(res, 200, true, "Product fetched successfully", formattedProduct);
  } catch (error) {
    next(error);
  }
};

// Search products by name
const searchProducts = async (req, res, next) => {
  try {
    console.log("Search endpoint hit!");
    console.log("Query params:", req.query);
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      console.log("No query provided");
      return sendResponse(res, 400, false, "Search query is required");
    }

    console.log("Searching for:", query);

    const searchTerm = `%${query.trim()}%`;
    const startsWithTerm = `${query.trim()}%`;

    const [rows] = await pool.query(
      `SELECT id, name, category, quantity, price, images 
       FROM home_page_products 
       WHERE name LIKE ? OR category LIKE ?
       ORDER BY 
         CASE 
           WHEN name LIKE ? THEN 1
           WHEN name LIKE ? THEN 2
           ELSE 3
         END,
         name ASC
       LIMIT 20`,
      [
        searchTerm,
        searchTerm,
        startsWithTerm,  // Starts with priority
        searchTerm,      // Contains priority
      ]
    );

    if (rows.length === 0) {
      return sendResponse(res, 200, true, "No products found", []);
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Products found", formattedRows);
  } catch (error) {
    console.error("Error searching products:", error);
    next(error);
  }
};

// Get similar products by category (excluding current product)
const getSimilarProducts = async (req, res, next) => {
  try {
    const { category, excludeId } = req.query;

    if (!category) {
      return sendResponse(res, 400, false, "Category is required");
    }

    let query = "SELECT id, name, quantity, price, images FROM home_page_products WHERE category = ?";
    const params = [category];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    // Remove LIMIT to get all products in category

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return sendResponse(res, 200, true, "No similar products found", []);
    }

    const formattedRows = formatImageUrls(req, rows);

    return sendResponse(res, 200, true, "Similar products fetched successfully", formattedRows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getDairyProducts,
  getTobaccoProducts,
  getSnackProducts,
  getProductById,
  getSimilarProducts,
  searchProducts
};
