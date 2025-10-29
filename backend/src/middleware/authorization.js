// const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const Authorization = async (req, res, next) => {
  try {
    // Extract token from cookie or Authorization header
    let token = null;

    if (req.cookies?.Authorization) {
      token = req.cookies.Authorization;
    } else if (req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") token = parts[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

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
      [token, decoded.userId]
    );

    if (rows.length === 0) {
      res.clearCookie("Authorization");
      return res
        .status(401)
        .json({ error: "Token revoked or invalid. Please login again." });
    }

    // Attach user info
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authorization middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = Authorization;
