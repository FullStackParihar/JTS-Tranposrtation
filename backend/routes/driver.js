import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDrivers,
  addDriver,
  deleteDriver
} from '../controllers/driverController.js';

const router = express.Router();

router
  .route('/')
  .get( getDrivers)
  .post( addDriver);

router
  .route('/:id')
  .delete(  deleteDriver);

export default router;