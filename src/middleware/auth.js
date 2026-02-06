const { verifyToken } = require('../utils/jwt');
const { sendUnauthorized, sendForbidden } = require('../utils/response');
const User = require('../models/User');
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided. Please login.');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return sendUnauthorized(res, error.message);
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return sendUnauthorized(res, 'User no longer exists');
    }

    // Attach user to request
    req.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return sendUnauthorized(res, 'Authentication failed');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return sendForbidden(res, 'You do not have permission to perform this action');
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        };
      }
    } catch (error) {
      // Token invalid or expired, continue without user
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth
};
