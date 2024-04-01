
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from request headers
    const token = req.header('Authorization').replace('Bearer ', '');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find user by id
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
