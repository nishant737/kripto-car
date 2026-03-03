import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Dealer from '../models/Dealer.js';

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register a new dealer
// @route   POST /api/dealer/register
// @access  Public
export const registerDealer = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Validate input
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, phone, and password'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ email: email.toLowerCase() });
    
    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: 'Dealer with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new dealer
    const dealer = await Dealer.create({
      email: email.toLowerCase(),
      phone,
      password: hashedPassword
    });

    // Generate JWT token
    const token = generateToken(dealer._id, dealer.role);

    // Return response without password
    res.status(201).json({
      success: true,
      token,
      dealer: {
        id: dealer._id,
        email: dealer.email,
        phone: dealer.phone,
        role: dealer.role,
        createdAt: dealer.createdAt
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Dealer with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login dealer
// @route   POST /api/dealer/login
// @access  Public
export const loginDealer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find dealer by email and include password field
    const dealer = await Dealer.findOne({ email: email.toLowerCase() }).select('+password');

    if (!dealer) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, dealer.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(dealer._id, dealer.role);

    // Return response without password
    res.status(200).json({
      success: true,
      token,
      dealer: {
        id: dealer._id,
        email: dealer.email,
        phone: dealer.phone,
        role: dealer.role,
        createdAt: dealer.createdAt
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Get dealer profile
// @route   GET /api/dealer/profile
// @access  Private (requires JWT)
export const getDealerProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.dealer.id);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    res.status(200).json({
      success: true,
      dealer: {
        id: dealer._id,
        email: dealer.email,
        phone: dealer.phone,
        role: dealer.role,
        createdAt: dealer.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};
