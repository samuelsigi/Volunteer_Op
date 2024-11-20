// utils/jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // For environment variables

const secretKey = process.env.JWT_SECRET;

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};

