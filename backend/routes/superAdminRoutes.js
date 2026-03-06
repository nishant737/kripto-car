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
import {
  createService,
  getServiceById,
  updateService,
  deleteService,
  uploadServiceImages,
  deleteServiceImage
} from '../controllers/serviceController.js';
import { addCar, updateCar, deleteCar, getMyCars } from '../controllers/carController.js';
import upload, { uploadCarImages } from '../middleware/upload.js';

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

// Service management routes (Super Admin only)
router.post('/services', createService);
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);
router.post('/services/upload-images', upload.array('images', 10), uploadServiceImages);
router.delete('/services/delete-image', deleteServiceImage);

// Car management routes (Super Admin only)
router.post('/cars', uploadCarImages, addCar);
router.get('/cars/dealer/:dealerId', getMyCars);
router.put('/cars/:id', uploadCarImages, updateCar);
router.delete('/cars/:id', deleteCar);

// Bookings routes
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Statistics route
router.get('/statistics', getPlatformStatistics);

export default router;
