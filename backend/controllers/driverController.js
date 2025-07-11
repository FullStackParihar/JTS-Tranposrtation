import asyncHandler from 'express-async-handler';
import Driver from '../models/Driver.js';

// Get all drivers
const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();
  res.json({ success: true, drivers });
});

// Add a new driver
const addDriver = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error('Name and phone are required');
  }

  const driver = new Driver({ name, phone });
  const createdDriver = await driver.save();
  res.status(201).json({ success: true, driver: createdDriver });
});

// Delete a driver
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error('Driver not found');
  }
  await driver.remove();
  res.json({ success: true, message: 'Driver deleted' });
});

export { getDrivers, addDriver, deleteDriver };