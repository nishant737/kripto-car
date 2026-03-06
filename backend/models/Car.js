import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer',
    required: [true, 'Dealer ID is required']
  },
  dealerName: {
    type: String,
    required: [true, 'Dealer name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Car brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  bodyType: {
    type: String,
    required: [true, 'Car body type is required'],
    enum: ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible', 'Wagon', 'Pickup Truck', 'EV/Electric', 'Luxury'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    }
  },
  specifications: {
    engine: {
      type: String,
      trim: true
    },
    mileage: {
      type: String,
      trim: true
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'],
      trim: true
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
      trim: true
    },
    seatingCapacity: {
      type: Number,
      min: 2,
      max: 10
    },
    color: {
      type: String,
      trim: true
    },
    year: {
      type: Number,
      min: 2000,
      max: new Date().getFullYear() + 1
    }
  },
  images: [{
    type: String,
    required: true
  }],
  contactPhone: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
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
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ price: 1 });
carSchema.index({ dealerId: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
