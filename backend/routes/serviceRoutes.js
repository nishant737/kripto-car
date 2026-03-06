import express from 'express';
import {
  getAllServices
} from '../controllers/serviceController.js';

const router = express.Router();

// Public routes
router.get('/browse', getAllServices);

// Note: Service creation, update, and deletion are now handled by Super Admin only
// All service management endpoints have been moved to superAdminRoutes.js

export default router;
