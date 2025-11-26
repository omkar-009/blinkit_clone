const express = require("express");
const router = express.Router();
const handleLogin = require("../middleware/handleLogin");
const Authorization = require("../middleware/authorization");
const { registerUser, getCurrentUser } = require("../controllers/user.controller")

// Register a new user
router.post( "/register", registerUser);

// Login route
router.post(
    "/login",
    handleLogin
);

// Get current user profile (protected route)
router.get("/profile", Authorization, getCurrentUser);

module.exports = router;
