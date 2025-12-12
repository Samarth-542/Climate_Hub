const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(403).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Ensure only admins can pass
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden: Admin access only" });
    }

    req.user = decoded; // Standardize on req.user
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
