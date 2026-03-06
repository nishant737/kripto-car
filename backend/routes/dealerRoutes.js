import express from 'express';
import { loginDealer, getDealerProfile } from '../controllers/dealerController.js';
import { addCar, getMyCars, updateCar, deleteCar } from '../controllers/carController.js';
import { protect } from '../middleware/auth.js';
import { uploadCarImages } from '../middleware/upload.js';

const router = express.Router();

// Public routes
// Note: Dealer registration is now handled by Super Admin only
router.post('/login', loginDealer);

// Protected routes
router.get('/profile', protect, getDealerProfile);

// Car management routes for dealers
router.post('/cars', protect, uploadCarImages, addCar);
router.get('/cars', protect, getMyCars);
router.put('/cars/:id', protect, uploadCarImages, updateCar);
router.delete('/cars/:id', protect, deleteCar);

export default router;
