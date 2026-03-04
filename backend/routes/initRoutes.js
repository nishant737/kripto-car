import express from 'express';
import bcrypt from 'bcryptjs';
import Dealer from '../models/Dealer.js';

const router = express.Router();

// @desc    Initialize super admin (ONE-TIME USE ONLY)
// @route   POST /api/init/superadmin
// @access  Public (should be removed after first use)
router.post('/superadmin', async (req, res) => {
  try {
    const { secretKey } = req.body;

    // Security check - require a secret key
    if (secretKey !== process.env.INIT_SECRET_KEY) {
      return res.status(403).json({
        success: false,
        message: 'Invalid initialization key'
      });
    }

    // Check if super admin already exists
    const existingAdmin = await Dealer.findOne({ role: 'superadmin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Super Admin already exists',
        email: existingAdmin.email
      });
    }

    // Get credentials from environment variables
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@kriptocar.com';
    const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '9999999999';
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);

    // Create super admin
    const superAdmin = await Dealer.create({
      email: SUPER_ADMIN_EMAIL,
      phone: SUPER_ADMIN_PHONE,
      password: hashedPassword,
      role: 'superadmin'
    });

    res.status(201).json({
      success: true,
      message: 'Super Admin account created successfully',
      admin: {
        email: superAdmin.email,
        phone: superAdmin.phone,
        role: superAdmin.role,
        createdAt: superAdmin.createdAt
      },
      warning: 'Please remove this initialization endpoint from production after use'
    });

  } catch (error) {
    console.error('Initialize super admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating super admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Check if super admin exists
// @route   GET /api/init/check-superadmin
// @access  Public
router.get('/check-superadmin', async (req, res) => {
  try {
    const existingAdmin = await Dealer.findOne({ role: 'superadmin' }).select('email createdAt');
    
    res.status(200).json({
      success: true,
      exists: !!existingAdmin,
      admin: existingAdmin ? {
        email: existingAdmin.email,
        createdAt: existingAdmin.createdAt
      } : null
    });

  } catch (error) {
    console.error('Check super admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error checking super admin'
    });
  }
});

export default router;
