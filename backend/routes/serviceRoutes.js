import express from 'express';
import {
  createService,
  getDealerServices,
  getServiceById,
  updateService,
  deleteService,
  getAllServices,
  uploadServiceImages,
  deleteServiceImage
} from '../controllers/serviceController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/browse', getAllServices);

// Protected routes (require dealer authentication)
router.post('/', protect, createService);
router.get('/my-services', protect, getDealerServices);
router.get('/:id', protect, getServiceById);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

// Image upload routes
router.post('/upload-images', protect, upload.array('images', 10), uploadServiceImages);
router.delete('/delete-image', protect, deleteServiceImage);

export default router;
