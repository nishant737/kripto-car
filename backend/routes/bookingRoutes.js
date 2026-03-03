import express from 'express';
import {
  createBooking,
  getDealerBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public route - customers can create bookings
router.post('/', createBooking);

// Protected routes (require dealer authentication)
router.get('/dealer', protect, getDealerBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

export default router;
