const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin123';

// Mock Admin User (In a real app, fetch from DB)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  passwordHash: bcrypt.hashSync(ADMIN_SECRET, 10),
};

router.post("/login", async (req, res) => {
  const { username, password, district } = req.body;

  if (username !== ADMIN_CREDENTIALS.username) {
    return res.status(401).json({ error: "Invalid username" });
  }

  const match = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = jwt.sign(
    { username, role: "admin", district: district || 'All' },
    JWT_SECRET,
    { expiresIn: "6h" }
  );

  res.json({ token, district: district || 'All' });
});

module.exports = router;
