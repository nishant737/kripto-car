import express from 'express';
import { protect, superAdmin } from '../middleware/auth.js';
import {
  getAllDealerships,
  getAllServices,
  getDealerServices,
  getAllBookings,
  getPlatformStatistics,
  addDealership,
  updateDealership,
  deleteDealership,
  updateBookingStatus
} from '../controllers/superAdminController.js';

const router = express.Router();

// All routes require authentication and super admin role
router.use(protect);
router.use(superAdmin);

// Dealership management routes
router.get('/dealerships', getAllDealerships);
router.post('/dealerships', addDealership);
router.put('/dealerships/:id', updateDealership);
router.delete('/dealerships/:id', deleteDealership);
router.get('/dealerships/:id/services', getDealerServices);

// Services routes
router.get('/services', getAllServices);

// Bookings routes
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Statistics route
router.get('/statistics', getPlatformStatistics);

export default router;
