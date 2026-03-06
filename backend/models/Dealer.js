import mongoose from 'mongoose';

const dealerSchema = new mongoose.Schema({
  dealershipName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  state: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    default: 'dealer',
    enum: ['dealer', 'superadmin']
  },
  assignedServices: [{
    type: String,
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
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Dealer = mongoose.model('Dealer', dealerSchema);

export default Dealer;
