import Booking from '../models/Booking.js';
import DealerService from '../models/DealerService.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const {
      dealerServiceId,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      customerLocation,
      carBrand,
      carModel,
      serviceRequirement,
      preferredDate,
      preferredTime,
      message
    } = req.body;

    // Verify that the dealer service exists
    const dealerService = await DealerService.findById(dealerServiceId);
    if (!dealerService) {
      return res.status(404).json({
        success: false,
        message: 'Dealer service not found'
      });
    }

    // Create new booking
    const booking = await Booking.create({
      dealerId: dealerService.dealerId,
      dealerServiceId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'noemail@example.com', // Make email optional
      customerAddress,
      customerLocation,
      carBrand,
      carModel,
      serviceRequirement,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0], // Default to today
      preferredTime: preferredTime || 'Not specified', // Default
      message: message || ''
    });

    // Populate dealer and service info
    await booking.populate('dealerServiceId', 'businessName serviceCategory');
    await booking.populate('dealerId', 'email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create booking'
    });
  }
};

// @desc    Get all bookings for a dealer
// @route   GET /api/bookings/dealer
// @access  Private (Dealer only)
export const getDealerBookings = async (req, res) => {
  try {
    const dealerId = req.dealer._id;

    const bookings = await Booking.find({ dealerId })
      .populate('dealerServiceId', 'businessName serviceCategory serviceType city state')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    console.error('Get dealer bookings error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch bookings'
    });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Dealer only)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('dealerServiceId', 'businessName serviceCategory serviceType city state')
      .populate('dealerId', 'email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking belongs to the authenticated dealer
    if (booking.dealerId._id.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch booking'
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Dealer only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking belongs to the authenticated dealer
    if (booking.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate('dealerServiceId', 'businessName serviceCategory');

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update booking status'
    });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Dealer only)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if the booking belongs to the authenticated dealer
    if (booking.dealerId.toString() !== req.dealer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking'
      });
    }

    await booking.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete booking'
    });
  }
};
