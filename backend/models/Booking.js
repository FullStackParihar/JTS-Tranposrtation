import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['bulk_transport', 'cold_chain', 'express_delivery', 'scheduled_pickup'],
    required: true
  },
  vehicleType: {
    type: String,
    enum: ['16ft_truck', '19ft_truck', 'pickup_truck', 'refrigerated_truck'],
    required: true
  },
  pickupLocation: {
    address: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    contactPerson: String,
    contactPhone: String
  },
  deliveryLocation: {
    address: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    contactPerson: String,
    contactPhone: String
  },
  scheduledPickup: {
    type: Date,
    required: true
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  cargo: {
    type: {
      type: String,
      enum: ['milk', 'dairy_products', 'other'],
      default: 'milk'
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['liters', 'kg', 'tons'],
      default: 'liters'
    },
    temperature: {
      required: Boolean,
      min: Number,
      max: Number
    },
    specialInstructions: String
  },
  pricing: {
    baseRate: { type: Number, required: true },
    distanceRate: Number,
    temperatureControlRate: Number,
    urgencyRate: Number,
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in_transit', 'delivered', 'cancelled'],
    default: 'pending'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  tracking: {
    currentLocation: {
      latitude: Number,
      longitude: Number,
      timestamp: Date
    },
    route: [{
      latitude: Number,
      longitude: Number,
      timestamp: Date
    }],
    estimatedArrival: Date
  },
  documents: [{
    type: {
      type: String,
      enum: ['invoice', 'delivery_receipt', 'quality_certificate', 'other']
    },
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

bookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'JTS' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);