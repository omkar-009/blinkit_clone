const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res, next) => {
  try {
    const { contact_no, email, password } = req.body;

    if (!password || (!contact_no && !email)) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: "Please provide either contact number or email, and password.",
      });
    }

    // Fetch user
    const query = contact_no
      ? "SELECT * FROM users WHERE contact_no = ?"
      : "SELECT * FROM users WHERE email = ?";
    const value = contact_no || email;

    const [rows] = await pool.query(query, [value]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, success: false, error: "User not found." });
    }

    const users = rows[0];

    const isPasswordValid = await bcrypt.compare(password, users.password_hash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: 401, success: false, error: "Invalid password." });
    }

    // Prepare token payload
    const tokenPayload = {
      user_id: users.user_id,
      user_name: users.username,
      email: users.email,
      contact_no: users.contact_no,
      created_at: users.created_at
    };

    // Generate JWT (no expiration)
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

    // Store raw token in DB
    await pool.query(
      "INSERT INTO tokens (user_id, username, access_token, created_at) VALUES (?, ?, ?, NOW())",
      [users.user_id, users.username, accessToken]
    );

    // Set cookie (httpOnly, secure, sameSite)
    res.cookie("Authorization", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Send response
    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      accessToken
    });
 
    console.log(`User logged in: ${users.email || users.contact_no}`);
  } catch (error) {
    next(error);
  }
};
 
module.exports = handleLogin;