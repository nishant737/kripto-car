import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  // Link to dealer and service
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: [true, 'Dealer ID is required']
  },
  dealerServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DealerService',
    required: [true, 'Dealer Service ID is required']
  },
  
  // Customer information
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'noemail@example.com'
  },
  customerAddress: {
    type: String,
    required: [true, 'Customer address is required'],
    trim: true
  },
  customerLocation: {
    type: String,
    required: [true, 'Customer location is required'],
    trim: true
  },
  
  // Service details
  carBrand: {
    type: String,
    trim: true
  },
  carModel: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  serviceRequirement: {
    type: String,
    required: [true, 'Service requirement is required'],
    trim: true
  },
  preferredDate: {
    type: String,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot be more than 500 characters']
  },
  
  // Booking status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
