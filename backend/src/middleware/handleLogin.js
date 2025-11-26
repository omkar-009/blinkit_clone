const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const handleLogin = async (req, res, next) => {
  try {
    let { contact_no, email, identifier, password } = req.body;

    if (identifier) {
        if (identifier.includes("@")) {
        email = identifier;
        } else {
        contact_no = identifier;
        }
    }

    if (!password || (!contact_no && !email)) {
      return res.status(400).json({
        status: 400,
        success: false,
        error: "Please provide either contact number or email, and password.",
      });
    }

    // Fetch user
    const query = contact_no
      ? "SELECT * FROM users WHERE contact_number = ?"
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
      contact_no: users.contact_number,
      created_at: users.created_at
    };

    // Generate JWT (no expiration)
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

    // Delete all old tokens for this user before creating new one
    await pool.query(
      "DELETE FROM tokens WHERE user_id = ?",
      [users.user_id]
    );
    console.log(`Deleted old tokens for user_id: ${users.user_id}`);

    // Store new token in DB
    await pool.query(
      "INSERT INTO tokens (user_id, username, access_token, created_at) VALUES (?, ?, ?, NOW())",
      [users.user_id, users.username, accessToken]
    );
    console.log(`New token created for user_id: ${users.user_id}`);

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
 
    console.log(`User logged in: ${users.email || users.contact_number}`);
  } catch (error) {
    next(error);
  }
};
 
module.exports = handleLogin;