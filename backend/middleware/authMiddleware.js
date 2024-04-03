const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid token");
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = verifyToken;