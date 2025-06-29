import express from 'express';
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  getVehicleById,
  updateVehicleLocation,
  getVehicleStats
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getVehicles)
  .post(authorize('admin', 'manager'), createVehicle);

router.get('/stats', authorize('admin', 'manager'), getVehicleStats);
router.get('/:id', getVehicleById);
router.put('/:id', authorize('admin', 'manager'), updateVehicle);
router.put('/:id/location', authorize('driver', 'admin', 'manager'), updateVehicleLocation);

export default router;