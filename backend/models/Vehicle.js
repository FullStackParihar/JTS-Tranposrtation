// import mongoose from 'mongoose';

// const vehicleSchema = new mongoose.Schema({
 
//   number: { type: String, required: true, unique: true },
//   type: { type: String, required: true },
//   capacity: { type: Number, required: true },
//   image: { type: String }  
// });

// export default mongoose.model('Vehicle', vehicleSchema);


import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  number: { type: String, required: true,  }, // Truck number
  type: { type: String, required: true },                 // Truck type
  capacity: { type: Number, required: true },             // Capacity in litres
  image: { type: String },                                // Image path or URL
  wheels: { type: Number, required: true },               // Number of wheels
  year: { type: Number, required: true },                 // Manufacturing year
  registrationNumber: { type: String, required: true },   // Registration number
  ownerContact: { type: String, required: true }          // Owner contact number
});

export default mongoose.model('Vehicle', vehicleSchema);