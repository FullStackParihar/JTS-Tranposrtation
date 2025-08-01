import express from 'express';
import {
  createBooking,
  getBookings,
  updateBooking,
  getBookingById,
  updateBookingStatus,
  assignDriver
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getBookings)
  .post(createBooking);

router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/assign',   assignDriver);
router.put('/:id', updateBooking);

export default router;