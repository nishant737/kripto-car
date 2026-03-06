import express from 'express';
import {
  getAllCars,
  getCarById,
  getFilterOptions
} from '../controllers/carController.js';

const router = express.Router();

// Public routes
router.get('/', getAllCars);
router.get('/filters/options', getFilterOptions);
router.get('/:id', getCarById);

// Note: Car creation, update, and deletion are now handled by Super Admin only
// All car management endpoints have been moved to superAdminRoutes.js

export default router;
