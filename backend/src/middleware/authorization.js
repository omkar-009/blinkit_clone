const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const Authorization = async (req, res, next) => {
  try {
    console.log("Authorization middleware called for:", req.method, req.originalUrl);
    console.log("Headers:", req.headers.authorization ? "Authorization header present" : "No Authorization header");
    console.log("Cookies:", req.cookies?.Authorization ? "Cookie present" : "No cookie");
    
    // Extract token from cookie or Authorization header
    let token = null;

    if (req.cookies?.Authorization) {
      token = req.cookies.Authorization;
    } else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      } else if (parts.length === 1) {
        // Handle case where token is sent without "Bearer" prefix
        token = parts[0];
      }
    }

    if (!token) {
      console.log("No token found in request");
      return res.status(401).json({ 
        status: 401,
        success: false,
        error: "Access token required" 
      });
    }
    
    console.log("Token found, verifying...");

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      res.clearCookie("Authorization");
      return res
        .status(401)
        .json({ error: "Invalid token. Please login again." });
    }

    // Check token existence in DB (revocation check)
    const [rows] = await pool.query(
      "SELECT * FROM tokens WHERE access_token = ? AND user_id = ?",
      [token, decoded.user_id]
    );

    if (rows.length === 0) {
      res.clearCookie("Authorization");
      return res
        .status(401)
        .json({ error: "Token revoked or invalid. Please login again." });
    }

    // Attach user info - ensure user_id is set
    req.user = {
      ...decoded,
      user_id: decoded.user_id || decoded.userId,
    };
    console.log("Token verified successfully, user_id:", req.user.user_id);
    console.log("Calling next() to proceed to route handler");
    next();
  } catch (error) {
    console.error("Authorization middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = Authorization;
