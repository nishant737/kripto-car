import jwt from 'jsonwebtoken';
import Dealer from '../models/Dealer.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get dealer from token and attach to request
      req.dealer = await Dealer.findById(decoded.id).select('-password');

      if (!req.dealer) {
        return res.status(401).json({
          success: false,
          message: 'Dealer not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Super Admin only middleware
export const superAdmin = (req, res, next) => {
  if (req.dealer && req.dealer.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized. Super Admin access required.'
    });
  }
};
