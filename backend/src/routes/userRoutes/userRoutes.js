const express = require("express");
const router = express.Router();
const handleLogin = require("../../middleware/handleLogin");
const bcrypt = require("bcrypt");
const pool = require("../../config/db");
const { sendResponse } = require("../../utils/response");

// Register a new user
router.post(
    "/register", 
    async (req, res, next) => {
    try {
        const { username, email, contact_no, password } = req.body;

        // Validation
        if (!username || !email || !password || !contact_no) {
        return sendResponse(
            res,
            400,
            false,
            "Please provide all required fields"
        );  
        }

        // Check if email already exists
        const [emailRows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
        );
        if (emailRows.length > 0) {
        return sendResponse(
            res,
            409,
            false,
            "User with this email already exists"
        );
        }

        // Check if contact number already exists
        const [contactRows] = await pool.query(
        "SELECT * FROM users WHERE contact_no = ?",
        [contact_no]
        );
        if (contactRows.length > 0) {
        return sendResponse(
            res,
            409,
            false,
            "User with this contact number already exists"
        );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const [result] = await pool.query(
        `INSERT INTO users 
                (username, email, contact_no, password_hash, raw_password, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())`,
        [
            username.trim(),
            email.trim(),
            contact_no.trim(),
            hashedPassword,
            password,
        ]
        );

        // Success response
        return sendResponse(res, 201, true, "User registered successfully", {
        userId: result.insertId,
        username,
        email,
        contact_no,
        });
    } catch (error) {
        next(error);
    }
});

// Login route
router.post(
    "/login",
    handleLogin
);

module.exports = router;
