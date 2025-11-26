const express = require("express");
const router = express.Router();
const handleLogin = require("../middleware/handleLogin");
const Authorization = require("../middleware/authorization");
const { registerUser, getCurrentUser, updateUserProfile } = require("../controllers/user.controller")

// Register a new user
router.post( "/register", registerUser);

// Login route
router.post(
    "/login",
    handleLogin
);

// Test route to verify routing works (no middleware)
router.get("/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "User routes are working" });
});

// Get current user profile (protected route)
router.get("/profile", async (req, res, next) => {
  console.log("Profile route matched!");
  next();
}, Authorization, getCurrentUser);

// Update user profile (protected route)
router.put("/profile", Authorization, updateUserProfile);

// Debug: Log all routes when router is loaded
console.log("User routes loaded:");
console.log("  POST /register");
console.log("  POST /login");
console.log("  GET  /profile");
console.log("  GET  /test");

module.exports = router;
