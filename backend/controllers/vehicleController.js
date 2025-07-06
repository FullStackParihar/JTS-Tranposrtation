 

// import Vehicle from '../models/Vehicle.js';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Fix __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Get all vehicles
// export const getVehicles = async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find();
//     res.status(200).json(vehicles);
//   } catch (err) {
//     console.error('Error fetching vehicles:', err);
//     res.status(500).json({ error: 'Server error while fetching vehicles' });
//   }
// };

// // Add a vehicle
// export const addVehicle = async (req, res) => {
//   try {
//     const { number, type, capacity, wheels, year, registrationNumber, ownerContact } = req.body;
//     // Validate required fields
//     if (!number || !type || !capacity || !wheels || !year || !registrationNumber || !ownerContact) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     let image = '';
//     if (req.file) {
//       image = `/uploads/${req.file.filename}`;
//     }

//     const vehicle = new Vehicle({
//       number,
//       type,
//       capacity,
//       wheels,
//       year,
//       registrationNumber,
//       ownerContact,
//       image
//     });
//     await vehicle.save();
//     res.status(201).json(vehicle);
//   } catch (err) {
//     console.error('Error adding vehicle:', err);
//     res.status(400).json({ error: 'Failed to add vehicle' });
//   }
// };

// // Delete a vehicle
// export const deleteVehicle = async (req, res) => {
//   try {
//     const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
//     if (!deletedVehicle) {
//       return res.status(404).json({ error: 'Vehicle not found' });
//     }
//     res.status(200).json({ message: 'Vehicle deleted successfully' });
//   } catch (err) {
//     console.error('Error deleting vehicle:', err);
//     res.status(400).json({ error: 'Failed to delete vehicle' });
//   }
// };
import Vehicle from '../models/Vehicle.js';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all vehicles
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Server error while fetching vehicles' });
  }
};

// Add a vehicle (Cloudinary upload)
export const addVehicle = async (req, res) => {
  try {
    const { number, type, capacity, wheels, year, registrationNumber, ownerContact } = req.body;
    console.log('Request body:', req.body);

    // Manual validation for required fields
    if (!number || !type || !capacity || !wheels || !year || !registrationNumber || !ownerContact) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (typeof number !== 'string' || number.trim() === '') {
      return res.status(400).json({ error: 'Vehicle number must be a non-empty string' });
    }
    if (typeof type !== 'string' || type.trim() === '') {
      return res.status(400).json({ error: 'Type must be a non-empty string' });
    }
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ error: 'Capacity must be a positive number' });
    }
    if (isNaN(wheels) || wheels <= 0 || !Number.isInteger(Number(wheels))) {
      return res.status(400).json({ error: 'Wheels must be a positive integer' });
    }
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Year must be between 1900 and next year' });
    }
    if (typeof registrationNumber !== 'string' || registrationNumber.trim() === '') {
      return res.status(400).json({ error: 'Registration number must be a non-empty string' });
    }
    if (typeof ownerContact !== 'string' || ownerContact.trim() === '') {
      return res.status(400).json({ error: 'Owner contact must be a non-empty string' });
    }

    // Validate file type and presence
    console.log('req.file:', req.file); // Debug: Check if file is received
    let image = 'https://res.cloudinary.com/your_cloud_name/image/upload/v1234567890/jts_vehicles/default.jpg'; // Default image URL
    if (req.file) {
      if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only JPG and PNG files are allowed' });
      }
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'jts_vehicles' });
      console.log('Cloudinary upload result:', result); // Debug: Check upload result
      if (!result.secure_url) {
        throw new Error('Cloudinary upload failed to return a secure URL');
      }
      image = result.secure_url;
    } else {
      console.log('No file uploaded, using default image');
    }

    const vehicle = new Vehicle({
      number,
      type,
      capacity: Number(capacity),
      wheels: Number(wheels),
      year: Number(year),
      registrationNumber,
      ownerContact,
      image,
    });
    await vehicle.save();

    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Error adding vehicle:', err);
    if (err.name === 'CloudinaryError') {
      return res.status(400).json({ error: 'Failed to upload image to Cloudinary' });
    }
    if (err.message === 'Cloudinary upload failed to return a secure URL') {
      return res.status(400).json({ error: 'Failed to process image upload' });
    }
    res.status(400).json({ error: 'Failed to add vehicle' });
  }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid vehicle ID' });
    }

    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (deletedVehicle.image && !deletedVehicle.image.includes('default.jpg')) {
      const publicId = deletedVehicle.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`jts_vehicles/${publicId}`);
    }

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(400).json({ error: 'Failed to delete vehicle' });
  }
};