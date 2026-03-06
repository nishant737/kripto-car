import Car from '../models/Car.js';
import Dealer from '../models/Dealer.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc    Add a new car listing
// @route   POST /api/cars
// @access  Private (Dealer only)
export const addCar = async (req, res) => {
  try {
    const dealerId = req.dealer._id;
    
    // Get dealer info
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealer not found'
      });
    }

    // Extract car data from request body
    const {
      dealerName,
      brand,
      model,
      bodyType,
      price,
      city,
      state,
      engine,
      mileage,
      transmission,
      fuelType,
      seatingCapacity,
      color,
      year,
      contactPhone,
      contactEmail,
      description
    } = req.body;

    // Validate required fields
    if (!brand || !model || !bodyType || !price || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: brand, model, body type, price, city, state'
      });
    }

    // Check if images are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one car image'
      });
    }

    // Get image paths
    const imagePaths = req.files.map(file => `/uploads/cars/${file.filename}`);

    // Create car listing
    const car = await Car.create({
      dealerId,
      dealerName: dealerName || dealer.email,
      brand,
      model,
      bodyType,
      price: parseFloat(price),
      location: {
        city,
        state
      },
      specifications: {
        engine,
        mileage,
        transmission,
        fuelType,
        seatingCapacity: seatingCapacity ? parseInt(seatingCapacity) : undefined,
        color,
        year: year ? parseInt(year) : undefined
      },
      images: imagePaths,
      contactPhone: contactPhone || dealer.phone,
      contactEmail: contactEmail || dealer.email,
      description,
      status: 'available'
    });

    res.status(201).json({
      success: true,
      message: 'Car listing created successfully',
      car
    });

  } catch (error) {
    console.error('Error adding car:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating car listing'
    });
  }
};

// @desc    Get all car listings (with filters)
// @route   GET /api/cars
// @access  Public
export const getAllCars = async (req, res) => {
  try {
    const { city, brand, model, bodyType, minPrice, maxPrice, fuelType, transmission, status } = req.query;

    // Build filter object
    const filter = {};
    
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (bodyType) filter.bodyType = bodyType;
    if (fuelType) filter['specifications.fuelType'] = fuelType;
    if (transmission) filter['specifications.transmission'] = transmission;
    if (status) filter.status = status;
    else filter.status = 'available'; // Default to available cars
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Fetch cars with filters, sorted by newest first
    const cars = await Car.find(filter)
      .populate('dealerId', 'email phone')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: cars.length,
      cars
    });

  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching car listings'
    });
  }
};

// @desc    Get single car details
// @route   GET /api/cars/:id
// @access  Public
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate('dealerId', 'email phone');

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    res.status(200).json({
      success: true,
      car
    });

  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching car details'
    });
  }
};

// @desc    Get cars listed by logged-in dealer
// @route   GET /api/cars/my-listings
// @access  Private (Dealer only)
export const getMyCars = async (req, res) => {
  try {
    const dealerId = req.dealer._id;

    const cars = await Car.find({ dealerId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: cars.length,
      cars
    });

  } catch (error) {
    console.error('Error fetching dealer cars:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your car listings'
    });
  }
};

// @desc    Update car listing
// @route   PUT /api/cars/:id
// @access  Private (Dealer only - own cars)
export const updateCar = async (req, res) => {
  try {
    const dealerId = req.dealer._id;
    const carId = req.params.id;

    // Find car and verify ownership
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (car.dealerId.toString() !== dealerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this car listing'
      });
    }

    // Extract update data
    const {
      dealerName,
      brand,
      model,
      bodyType,
      price,
      city,
      state,
      engine,
      mileage,
      transmission,
      fuelType,
      seatingCapacity,
      color,
      year,
      contactPhone,
      contactEmail,
      description,
      status
    } = req.body;

    // Update car data
    if (dealerName) car.dealerName = dealerName;
    if (brand) car.brand = brand;
    if (model) car.model = model;
    if (bodyType) car.bodyType = bodyType;
    if (price) car.price = parseFloat(price);
    if (city) car.location.city = city;
    if (state) car.location.state = state;
    if (engine) car.specifications.engine = engine;
    if (mileage) car.specifications.mileage = mileage;
    if (transmission) car.specifications.transmission = transmission;
    if (fuelType) car.specifications.fuelType = fuelType;
    if (seatingCapacity) car.specifications.seatingCapacity = parseInt(seatingCapacity);
    if (color) car.specifications.color = color;
    if (year) car.specifications.year = parseInt(year);
    if (contactPhone) car.contactPhone = contactPhone;
    if (contactEmail) car.contactEmail = contactEmail;
    if (description) car.description = description;
    if (status) car.status = status;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images from filesystem
      car.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
      
      // Set new images
      const imagePaths = req.files.map(file => `/uploads/cars/${file.filename}`);
      car.images = imagePaths;
    }

    await car.save();

    res.status(200).json({
      success: true,
      message: 'Car listing updated successfully',
      car
    });

  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating car listing'
    });
  }
};

// @desc    Delete car listing
// @route   DELETE /api/cars/:id
// @access  Private (Dealer only - own cars)
export const deleteCar = async (req, res) => {
  try {
    const dealerId = req.dealer._id;
    const carId = req.params.id;

    // Find car and verify ownership
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }

    if (car.dealerId.toString() !== dealerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this car listing'
      });
    }

    // Delete images from filesystem
    car.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Delete car from database
    await Car.findByIdAndDelete(carId);

    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting car listing'
    });
  }
};

// @desc    Get filter options (unique brands, models, cities)
// @route   GET /api/cars/filters/options
// @access  Public
export const getFilterOptions = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    const cities = await Car.distinct('location.city');
    const bodyTypes = await Car.distinct('bodyType');
    
    // Get models grouped by brand
    const cars = await Car.find({ status: 'available' }, 'brand model').lean();
    const modelsByBrand = {};
    
    cars.forEach(car => {
      if (!modelsByBrand[car.brand]) {
        modelsByBrand[car.brand] = new Set();
      }
      modelsByBrand[car.brand].add(car.model);
    });
    
    // Convert sets to arrays
    Object.keys(modelsByBrand).forEach(brand => {
      modelsByBrand[brand] = Array.from(modelsByBrand[brand]);
    });

    res.status(200).json({
      success: true,
      filters: {
        brands: brands.sort(),
        cities: cities.sort(),
        bodyTypes: bodyTypes.sort(),
        modelsByBrand
      }
    });

  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching filter options'
    });
  }
};
