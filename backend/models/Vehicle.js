import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['16ft_truck', '19ft_truck', 'pickup_truck', 'refrigerated_truck'],
    required: true
  },
  capacity: {
    volume: { type: Number, required: true }, // in liters
    weight: { type: Number, required: true }  // in kg
  },
  specifications: {
    make: String,
    model: String,
    year: Number,
    fuelType: {
      type: String,
      enum: ['diesel', 'petrol', 'cng', 'electric']
    },
    hasRefrigeration: { type: Boolean, default: false },
    temperatureRange: {
      min: Number,
      max: Number
    }
  },
  status: {
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'out_of_service'],
    default: 'available'
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: { type: Date, default: Date.now }
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  maintenance: [{
    type: {
      type: String,
      enum: ['routine', 'repair', 'inspection', 'emergency']
    },
    description: String,
    cost: Number,
    date: { type: Date, default: Date.now },
    nextDue: Date
  }],
  documents: {
    registration: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    },
    insurance: {
      policyNumber: String,
      provider: String,
      expiryDate: Date,
      documentUrl: String
    },
    permit: {
      number: String,
      expiryDate: Date,
      documentUrl: String
    }
  },
  fuelEfficiency: Number, // km per liter
  averageSpeed: Number,   // km per hour
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model('Vehicle', vehicleSchema);