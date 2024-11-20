const jwt = require('jsonwebtoken');
const { User } = require('../model/UserModel'); // Ensure the correct import

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Unauthorized: No or invalid token provided' }));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Unauthorized: User not found' }));
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Unauthorized: Token has expired' }));
    }

    console.error('Error in authentication middleware:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: 'Server error' }));
  }
};

module.exports = { isAuthenticated };
