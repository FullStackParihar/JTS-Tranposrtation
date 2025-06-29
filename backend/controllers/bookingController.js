// import Booking from '../models/Booking.js';
// import Vehicle from '../models/Vehicle.js';
// import User from '../models/User.js';

// export const createBooking = async (req, res) => {
//   try {
//     const bookingData = {
//       ...req.body,
//       customer: req.user.id
//     };

//     // Calculate pricing based on distance and service type
//     const baseRate = calculateBaseRate(bookingData.vehicleType, bookingData.serviceType);
//     const distance = await calculateDistance(
//       bookingData.pickupLocation.coordinates,
//       bookingData.deliveryLocation.coordinates
//     );
    
//     bookingData.pricing = {
//       baseRate,
//       distanceRate: distance * 10, // ₹10 per km
//       temperatureControlRate: bookingData.cargo.temperature?.required ? 500 : 0,
//       totalAmount: baseRate + (distance * 10) + (bookingData.cargo.temperature?.required ? 500 : 0)
//     };

//     const booking = await Booking.create(bookingData);
//     await booking.populate('customer', 'name email phone');

//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       booking
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getBookings = async (req, res) => {
//   try {
//     const { status, page = 1, limit = 10 } = req.query;
//     const query = { customer: req.user.id };
    
//     if (status) query.status = status;

//     const bookings = await Booking.find(query)
//       .populate('driver', 'name phone')
//       .populate('vehicle', 'vehicleNumber type')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const total = await Booking.countDocuments(query);

//     res.json({
//       success: true,
//       bookings,
//       pagination: {
//         current: page,
//         pages: Math.ceil(total / limit),
//         total
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const getBookingById = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate('customer', 'name email phone companyName')
//       .populate('driver', 'name phone')
//       .populate('vehicle', 'vehicleNumber type specifications');

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Check if user owns this booking or is admin/driver
//     if (booking.customer._id.toString() !== req.user.id && 
//         req.user.role !== 'admin' && 
//         req.user.role !== 'manager' &&
//         booking.driver?._id.toString() !== req.user.id) {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     res.json({ success: true, booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const updateBookingStatus = async (req, res) => {
//   try {
//     const { status, location } = req.body;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Only admin, manager, or assigned driver can update status
//     if (req.user.role !== 'admin' && 
//         req.user.role !== 'manager' &&
//         booking.driver?.toString() !== req.user.id) {
//       return res.status(403).json({ error: 'Access denied' });
//     }

//     booking.status = status;
    
//     if (location) {
//       booking.tracking.currentLocation = {
//         ...location,
//         timestamp: new Date()
//       };
//       booking.tracking.route.push({
//         ...location,
//         timestamp: new Date()
//       });
//     }

//     if (status === 'delivered') {
//       booking.actualDelivery = new Date();
//     }

//     await booking.save();

//     res.json({ success: true, booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const assignDriver = async (req, res) => {
//   try {
//     const { driverId, vehicleId } = req.body;
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }

//     // Check if driver and vehicle are available
//     const driver = await User.findById(driverId);
//     const vehicle = await Vehicle.findById(vehicleId);

//     if (!driver || driver.role !== 'driver') {
//       return res.status(400).json({ error: 'Invalid driver' });
//     }

//     if (!vehicle || vehicle.status !== 'available') {
//       return res.status(400).json({ error: 'Vehicle not available' });
//     }

//     booking.driver = driverId;
//     booking.vehicle = vehicleId;
//     booking.status = 'assigned';

//     vehicle.status = 'in_use';
//     await vehicle.save();
//     await booking.save();

//     res.json({ success: true, booking });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const calculateBaseRate = (vehicleType, serviceType) => {
//   const rates = {
//     '16ft_truck': { bulk_transport: 2000, cold_chain: 2500, express_delivery: 3000 },
//     '19ft_truck': { bulk_transport: 2500, cold_chain: 3000, express_delivery: 3500 },
//     'pickup_truck': { bulk_transport: 1500, cold_chain: 2000, express_delivery: 2500 },
//     'refrigerated_truck': { bulk_transport: 3000, cold_chain: 3500, express_delivery: 4000 }
//   };
  
//   return rates[vehicleType]?.[serviceType] || 2000;
// };

// const calculateDistance = async (origin, destination) => {
//   // Simplified distance calculation - in production, use Google Maps API
//   const R = 6371; // Earth's radius in km
//   const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
//   const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
//   const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
//     Math.sin(dLon/2) * Math.sin(dLon/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   return R * c;
// };

import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      customer: req.user.id
    };

    // Validate coordinates
    if (!bookingData.pickupLocation.coordinates || !bookingData.deliveryLocation.coordinates) {
      return res.status(400).json({ error: 'Coordinates are required for pickup and delivery locations' });
    }

    // Calculate pricing based on distance and service type
    const baseRate = calculateBaseRate(bookingData.vehicleType, bookingData.serviceType);
    const distance = await calculateDistance(
      bookingData.pickupLocation.coordinates,
      bookingData.deliveryLocation.coordinates
    );
    
    bookingData.pricing = {
      baseRate,
      distanceRate: distance * 10, // ₹10 per km
      temperatureControlRate: bookingData.cargo.temperature?.required ? 500 : 0,
      totalAmount: baseRate + (distance * 10) + (bookingData.cargo.temperature?.required ? 500 : 0)
    };

    const booking = await Booking.create(bookingData);
    await booking.populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { customer: req.user.id };
    
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('driver', 'name phone')
      .populate('vehicle', 'vehicleNumber type')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
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

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone companyName')
      .populate('driver', 'name phone')
      .populate('vehicle', 'vehicleNumber type specifications');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if user owns this booking or is admin/driver
    if (booking.customer._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        booking.driver?._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, location } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Only admin, manager, or assigned driver can update status
    if (req.user.role !== 'admin' && 
        req.user.role !== 'manager' &&
        booking.driver?.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    booking.status = status;
    
    if (location) {
      booking.tracking.currentLocation = {
        ...location,
        timestamp: new Date()
      };
      booking.tracking.route.push({
        ...location,
        timestamp: new Date()
      });
    }

    if (status === 'delivered') {
      booking.actualDelivery = new Date();
    }

    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignDriver = async (req, res) => {
  try {
    const { driverId, vehicleId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if driver and vehicle are available
    const driver = await User.findById(driverId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({ error: 'Invalid driver' });
    }

    if (!vehicle || vehicle.status !== 'available') {
      return res.status(400).json({ error: 'Vehicle not available' });
    }

    booking.driver = driverId;
    booking.vehicle = vehicleId;
    booking.status = 'assigned';

    vehicle.status = 'in_use';
    await vehicle.save();
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateBaseRate = (vehicleType, serviceType) => {
  const rates = {
    '16ft_truck': { bulk_transport: 2000, cold_chain: 2500, express_delivery: 3000 },
    '19ft_truck': { bulk_transport: 2500, cold_chain: 3000, express_delivery: 3500 },
    'pickup_truck': { bulk_transport: 1500, cold_chain: 2000, express_delivery: 2500 },
    'refrigerated_truck': { bulk_transport: 3000, cold_chain: 3500, express_delivery: 4000 }
  };
  
  return rates[vehicleType]?.[serviceType] || 2000;
};

const calculateDistance = async (origin, destination) => {
  // Simplified distance calculation - in production, use Google Maps API
  const R = 6371; // Earth's radius in km
  const dLat = (destination.latitude - origin.latitude) * Math.PI / 180;
  const dLon = (destination.longitude - origin.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(origin.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};