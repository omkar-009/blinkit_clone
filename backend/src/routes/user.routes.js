const express = require("express");
const router = express.Router();
const handleLogin = require("../middleware/handleLogin");
const { registerUser } = require("../controllers/user.controller")

// Register a new user
router.post( "/register", registerUser);

// Login route
router.post(
    "/login",
    handleLogin
);

module.exports = router;
