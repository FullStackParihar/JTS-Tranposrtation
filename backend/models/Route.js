import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  origin: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  destination: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  waypoints: [{
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    estimatedTime: Number // minutes from previous point
  }],
  distance: { type: Number, required: true }, // in kilometers
  estimatedDuration: { type: Number, required: true }, // in minutes
  baseRate: { type: Number, required: true }, // per km
  tollCharges: Number,
  fuelCost: Number,
  isActive: { type: Boolean, default: true },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  roadConditions: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  }
}, {
  timestamps: true
});

export default mongoose.model('Route', routeSchema);