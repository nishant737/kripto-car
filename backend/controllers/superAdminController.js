import bcrypt from 'bcryptjs';
import Dealer from '../models/Dealer.js';
import DealerService from '../models/DealerService.js';
import Booking from '../models/Booking.js';

// @desc    Get all dealerships
// @route   GET /api/superadmin/dealerships
// @access  Private (Super Admin only)
export const getAllDealerships = async (req, res) => {
  try {
    const dealerships = await Dealer.find({ role: 'dealer' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dealerships.length,
      dealerships
    });
  } catch (error) {
    console.error('Get dealerships error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dealerships'
    });
  }
};

// @desc    Get all dealer services
// @route   GET /api/superadmin/services
// @access  Private (Super Admin only)
export const getAllServices = async (req, res) => {
  try {
    const services = await DealerService.find()
      .populate('dealerId', 'email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching services'
    });
  }
};

// @desc    Get services by dealer ID
// @route   GET /api/superadmin/dealerships/:id/services
// @access  Private (Super Admin only)
export const getDealerServices = async (req, res) => {
  try {
    const dealerId = req.params.id;

    // Verify dealer exists
    const dealer = await Dealer.findById(dealerId).select('-password');
    
    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found'
      });
    }

    // Get all services for this dealer
    const services = await DealerService.find({ dealerId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      dealer: {
        id: dealer._id,
        email: dealer.email,
        phone: dealer.phone,
        createdAt: dealer.createdAt
      },
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get dealer services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dealer services'
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/superadmin/bookings
// @access  Private (Super Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('dealerId', 'email phone')
      .populate('dealerServiceId', 'businessName serviceCategory state city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching bookings'
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/superadmin/statistics
// @access  Private (Super Admin only)
export const getPlatformStatistics = async (req, res) => {
  try {
    // Count total dealerships
    const totalDealerships = await Dealer.countDocuments({ role: 'dealer' });

    // Count total services
    const totalServices = await DealerService.countDocuments();

    // Count total bookings
    const totalBookings = await Booking.countDocuments();

    // Count bookings by status
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Get active services
    const activeServices = await DealerService.countDocuments({ isActive: true });

    // Get recent dealerships (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDealerships = await Dealer.countDocuments({
      role: 'dealer',
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get recent bookings (last 30 days)
    const recentBookings = await Booking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      statistics: {
        totalDealerships,
        totalServices,
        totalBookings,
        activeServices,
        recentDealerships,
        recentBookings,
        bookingsByStatus: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        }
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
};

// @desc    Add a new dealership manually
// @route   POST /api/superadmin/dealerships
// @access  Private (Super Admin only)
export const addDealership = async (req, res) => {
  try {
    const { dealershipName, email, phone, password, state, city, assignedServices } = req.body;

    // Validate input
    if (!email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, phone, and password'
      });
    }

    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ email: email.toLowerCase() });
    
    if (existingDealer) {
      return res.status(400).json({
        success: false,
        message: 'Dealership with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new dealer with assigned services
    const dealer = await Dealer.create({
      dealershipName,
      email: email.toLowerCase(),
      phone,
      state,
      city,
      password: hashedPassword,
      role: 'dealer',
      assignedServices: assignedServices || []
    });

    res.status(201).json({
      success: true,
      message: 'Dealership created successfully',
      dealer: {
        id: dealer._id,
        dealershipName: dealer.dealershipName,
        email: dealer.email,
        phone: dealer.phone,
        state: dealer.state,
        city: dealer.city,
        role: dealer.role,
        assignedServices: dealer.assignedServices,
        createdAt: dealer.createdAt
      }
    });
  } catch (error) {
    console.error('Add dealership error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error adding dealership'
    });
  }
};

// @desc    Update dealership information
// @route   PUT /api/superadmin/dealerships/:id
// @access  Private (Super Admin only)
export const updateDealership = async (req, res) => {
  try {
    const { dealershipName, email, phone, password, state, city, assignedServices } = req.body;
    const dealerId = req.params.id;

    const dealer = await Dealer.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found'
      });
    }

    // Prevent updating super admin accounts
    if (dealer.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot update super admin account'
      });
    }

    // Update fields
    if (dealershipName !== undefined) dealer.dealershipName = dealershipName;
    if (email) dealer.email = email.toLowerCase();
    if (phone) dealer.phone = phone;
    if (state !== undefined) dealer.state = state;
    if (city !== undefined) dealer.city = city;
    if (assignedServices !== undefined) dealer.assignedServices = assignedServices;
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      dealer.password = await bcrypt.hash(password, salt);
    }

    await dealer.save();

    res.status(200).json({
      success: true,
      message: 'Dealership updated successfully',
      dealer: {
        id: dealer._id,
        dealershipName: dealer.dealershipName,
        email: dealer.email,
        phone: dealer.phone,
        state: dealer.state,
        city: dealer.city,
        role: dealer.role,
        assignedServices: dealer.assignedServices,
        createdAt: dealer.createdAt
      }
    });
  } catch (error) {
    console.error('Update dealership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating dealership'
    });
  }
};

// @desc    Delete a dealership
// @route   DELETE /api/superadmin/dealerships/:id
// @access  Private (Super Admin only)
export const deleteDealership = async (req, res) => {
  try {
    const dealerId = req.params.id;

    const dealer = await Dealer.findById(dealerId);

    if (!dealer) {
      return res.status(404).json({
        success: false,
        message: 'Dealership not found'
      });
    }

    // Prevent deleting super admin accounts
    if (dealer.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete super admin account'
      });
    }

    // Delete dealer's services
    await DealerService.deleteMany({ dealerId });

    // Delete dealer's bookings
    await Booking.deleteMany({ dealerId });

    // Delete dealer
    await Dealer.findByIdAndDelete(dealerId);

    res.status(200).json({
      success: true,
      message: 'Dealership and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete dealership error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting dealership'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/superadmin/bookings/:id/status
// @access  Private (Super Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating booking status'
    });
  }
};
