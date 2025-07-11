import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
});

export default mongoose.model('Driver', driverSchema);