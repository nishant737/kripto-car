import mongoose from 'mongoose';

const dealerServiceSchema = new mongoose.Schema({
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: [true, 'Dealer ID is required']
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  serviceCategory: {
    type: String,
    required: [true, 'Service category is required'],
    enum: [
      'New Cars',
      'Used Cars',
      'Tyres & Wheels',
      'Wheel Alignment & Suspension',
      'Car Wash & Cleaning',
      'Car Detailing Services',
      'Denting & Painting',
      'Emission Test & Legal Services',
      'General Service & Maintenance',
      'Accessories & Customization'
    ]
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  openingTime: {
    type: String,
    required: [true, 'Opening time is required'],
    trim: true
  },
  closingTime: {
    type: String,
    required: [true, 'Closing time is required'],
    trim: true
  },
  contactPhone: {
    type: String,
    required: [true, 'Contact phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
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
dealerServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const DealerService = mongoose.model('DealerService', dealerServiceSchema);

export default DealerService;
