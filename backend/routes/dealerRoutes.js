import express from 'express';
import { registerDealer, loginDealer, getDealerProfile } from '../controllers/dealerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerDealer);
router.post('/login', loginDealer);

// Protected routes
router.get('/profile', protect, getDealerProfile);

export default router;
