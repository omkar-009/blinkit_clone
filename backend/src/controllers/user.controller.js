const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { sendResponse } = require("../utils/response");

// Get current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    console.log("getCurrentUser controller called");
    console.log("req.user:", req.user);
    const userId = req.user?.user_id;

    if (!userId) {
      return sendResponse(res, 401, false, "User not authenticated");
    }

    // Check if contact_number column exists, if not use contact_no
    let contactColumn = 'contact_number';
    try {
      const [colCheck] = await pool.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'contact_number'"
      );
      if (colCheck.length === 0) {
        // Check if contact_no exists instead
        const [colCheck2] = await pool.query(
          "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'contact_no'"
        );
        if (colCheck2.length > 0) {
          contactColumn = 'contact_no';
        } else {
          // Neither exists, add contact_number
          await pool.query("ALTER TABLE users ADD COLUMN contact_number VARCHAR(15)");
        }
      }
    } catch (e) {
      console.log("Column check error:", e.message);
    }

    // Fetch user from database
    const [rows] = await pool.query(
      `SELECT user_id, username, email, ${contactColumn} as contact_number, address FROM users WHERE user_id = ?`,
      [userId]
    );
    
    if (rows.length === 0) {
      return sendResponse(res, 404, false, "User not found");
    }

    if (rows.length === 0) {
      return sendResponse(res, 404, false, "User not found");
    }

    const user = rows[0];
    // Remove sensitive data
    delete user.password_hash;
    delete user.password;

    return sendResponse(res, 200, true, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
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
        "SELECT * FROM users WHERE contact_number = ?",
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
                (username, email, contact_number, password_hash, password, created_at)
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
};


  // Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    const { username, email, contact_number, address } = req.body;

    if (!userId) {
      return sendResponse(res, 401, false, "User not authenticated");
    }

    // Validate required fields
    if (!username || !email || !contact_number) {
      return sendResponse(res, 400, false, "Username, email, and contact number are required");
    }

    // Check if email is already taken by another user
    const [emailRows] = await pool.query(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email, userId]
    );
    if (emailRows.length > 0) {
      return sendResponse(res, 409, false, "Email already in use by another account");
    }

    // Check if contact number is already taken by another user
    const [contactRows] = await pool.query(
      "SELECT user_id FROM users WHERE contact_number = ? AND user_id != ?",
      [contact_number, userId]
    );
    if (contactRows.length > 0) {
      return sendResponse(res, 409, false, "Contact number already in use by another account");
    }

    // Update user profile
    await pool.query(
      `UPDATE users 
       SET username = ?, email = ?, contact_number = ?, address = ?
       WHERE user_id = ?`,
      [username.trim(), email.trim(), contact_number.trim(), address?.trim() || null, userId]
    );

    // Fetch updated user
    const [updatedRows] = await pool.query(
      "SELECT user_id, username, email, contact_number, address FROM users WHERE user_id = ?",
      [userId]
    );

    if (updatedRows.length === 0) {
      return sendResponse(res, 404, false, "User not found");
    }

    const updatedUser = updatedRows[0];
    delete updatedUser.password_hash;
    delete updatedUser.password;

    return sendResponse(res, 200, true, "Profile updated successfully", updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};

module.exports = {
    registerUser,
    getCurrentUser,
    updateUserProfile
}