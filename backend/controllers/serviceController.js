import DealerService from '../models/DealerService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc    Create a new dealer service
// @route   POST /api/services
// @access  Private (Dealer only)
export const createService = async (req, res) => {
  try {
    const {
      businessName,
      serviceCategory,
      serviceType,
      state,
      city,
      openingTime,
      closingTime,
      contactPhone,
      description,
      images
    } = req.body;

    // Get dealer ID from authenticated user
    const dealerId = req.dealer._id;

    // Parse images if it's a string (from JSON)
    let imageArray = [];
    if (images) {
      imageArray = typeof images === 'string' ? JSON.parse(images) : images;
    }

    // Create new service
    const service = await DealerService.create({
      dealerId,
      businessName,
      serviceCategory,
      serviceType,
      state,
      city,
      openingTime,
      closingTime,
      contactPhone,
      description,
      images: imageArray
    });

    res.status(201).json({
      success: true,
      message: 'Service registered successfully',
      service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to register service'
    });
  }
};

// @desc    Get all services for a dealer
// @route   GET /api/services/my-services
// @access  Private (Dealer only)
export const getDealerServices = async (req, res) => {
  try {
    const dealerId = req.dealer._id;

    const services = await DealerService.find({ dealerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get dealer services error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch services'
    });
  }
};

// @desc    Get a single service by ID
// @route   GET /api/services/:id
// @access  Private (Dealer only)
export const getServiceById = async (req, res) => {
  try {
    const service = await DealerService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if the service belongs to the authenticated dealer
    if (service.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this service'
      });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch service'
    });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Dealer only)
export const updateService = async (req, res) => {
  try {
    let service = await DealerService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if the service belongs to the authenticated dealer
    if (service.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service'
      });
    }

    // Parse images if it's a string (from JSON)
    if (req.body.images) {
      req.body.images = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
    }

    service = await DealerService.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update service'
    });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Dealer only)
export const deleteService = async (req, res) => {
  try {
    const service = await DealerService.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if the service belongs to the authenticated dealer
    if (service.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service'
      });
    }

    // Delete associated images
    if (service.images && service.images.length > 0) {
      service.images.forEach(imagePath => {
        const filename = path.basename(imagePath);
        const filePath = path.join(__dirname, '..', 'uploads', 'services', filename);
        
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Error deleting image:', err);
          }
        }
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete service'
    });
  }
};

// @desc    Get all services (for customers to browse)
// @route   GET /api/services/browse
// @access  Public
export const getAllServices = async (req, res) => {
  try {
    const { serviceCategory, state, city } = req.query;

    // Build query
    const query = { isActive: true };
    if (serviceCategory) query.serviceCategory = serviceCategory;
    if (state) query.state = state;
    if (city) query.city = city;

    const services = await DealerService.find(query)
      .populate('dealerId', 'email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch services'
    });
  }
};

// @desc    Upload service images
// @route   POST /api/services/upload-images
// @access  Private (Dealer only)
export const uploadServiceImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images uploaded'
      });
    }

    // Get the file paths
    const imagePaths = req.files.map(file => `/uploads/services/${file.filename}`);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: imagePaths
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to upload images'
    });
  }
};

// @desc    Delete a service image
// @route   DELETE /api/services/delete-image
// @access  Private (Dealer only)
export const deleteServiceImage = async (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Image path is required'
      });
    }

    // Extract filename from path
    const filename = path.basename(imagePath);
    const filePath = path.join(__dirname, '..', 'uploads', 'services', filename);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
};
