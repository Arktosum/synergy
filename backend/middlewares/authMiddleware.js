const jwt = require("jsonwebtoken");

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).send("Access denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = decoded;
    next();
  });
};
