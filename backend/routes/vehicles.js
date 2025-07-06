// import express from 'express';
 
// import { getVehicles, addVehicle, deleteVehicle } from '../controllers/vehicleController.js';

// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// const router = express.Router();
// // Fix __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Multer setup for image upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads'));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });

// // GET all vehicles
// router.get('/',  getVehicles);

// // POST add a vehicle (with image)
// router.post('/', upload.single('image'), addVehicle);

// // DELETE a vehicle
// router.delete('/:id', deleteVehicle);

// export default router;

import express from 'express';
import { getVehicles, addVehicle, deleteVehicle } from '../controllers/vehicleController.js';
import multer from 'multer';
import { storage } from '../helpers/helper.js';
 

const router = express.Router();

const upload = multer({ storage });

// Authentication middleware
 

// GET all vehicles
router.get('/', getVehicles);

// POST add a vehicle (with image)
router.post('/', upload.single('image'), addVehicle);

// DELETE a vehicle
router.delete('/:id', deleteVehicle);

export default router;