import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';

export const getVehicles = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;

    const vehicles = await Vehicle.find(query)
      .populate('driver', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vehicle.countDocuments(query);

    res.json({
      success: true,
      vehicles,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully',
      vehicle
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('driver', 'name phone email');

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Get current booking for this vehicle
    const currentBooking = await Booking.findOne({
      vehicle: vehicle._id,
      status: { $in: ['assigned', 'in_transit'] }
    }).populate('customer', 'name companyName');

    res.json({ 
      success: true, 
      vehicle: {
        ...vehicle.toObject(),
        currentBooking
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVehicleLocation = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicle.currentLocation = {
      latitude,
      longitude,
      address,
      lastUpdated: new Date()
    };

    await vehicle.save();

    // Update tracking for active bookings
    await Booking.updateMany(
      { vehicle: vehicle._id, status: { $in: ['assigned', 'in_transit'] } },
      {
        $set: {
          'tracking.currentLocation': {
            latitude,
            longitude,
            timestamp: new Date()
          }
        },
        $push: {
          'tracking.route': {
            latitude,
            longitude,
            timestamp: new Date()
          }
        }
      }
    );

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleStats = async (req, res) => {
  try {
    const stats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const typeStats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        byStatus: stats,
        byType: typeStats,
        total: await Vehicle.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};