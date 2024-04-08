const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Token missing. Please log in." });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next(); // Move to the next middleware/route handler
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again." });
  }
}

module.exports = verifyToken;
