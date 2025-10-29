const express = require("express");
const router = express.Router();
const { registerUser } = require("../../controllers/user/userController");

// Register a new user
router.post("/register", registerUser);

module.exports = router;
