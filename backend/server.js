 
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
 
import { rateLimit } from 'express-rate-limit';
import winston from 'winston';

// Import routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import vehicleRoutes from './routes/vehicles.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://jts-tranposrtation1.onrender.com',
  credentials: true,
}));
app.use(limiter); // Apply rate limiting to all routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('MongoDB Connected ✅'))
  .catch(err => logger.error('MongoDB Connection Error ❌', err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    logger.error('SMTP connection error:', error);
  } else {
    logger.info('Email service ready ✅');
  }
});

// JWT Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Attach decoded user info to request
//     next();
//   } catch (error) {
//     logger.error('Invalid token:', error);
//     res.status(403).json({ error: 'Invalid token.' });
//   }
// };

// Routes
app.get('/',(req,res)=>{
  console.log('hello')
  res.send('hello')
})
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
    subject: "New Contact Form Submission - JTS",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTimestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Contact email sent:', { messageId: info.messageId });
    res.status(200).json({ success: "Message sent successfully!" });
  } catch (error) {
    logger.error('Error sending contact email:', error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Quote calculation endpoint (new)
app.get("/api/calculate-quote", (req, res) => {
  try {
    const { serviceType, vehicleType, cargoQuantity, pickupLocation, deliveryLocation } = req.query;

    // Validate required fields
    if (!serviceType || !vehicleType || !cargoQuantity || !pickupLocation || !deliveryLocation) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const parsedCargoQuantity = parseInt(cargoQuantity);
    if (isNaN(parsedCargoQuantity) || parsedCargoQuantity <= 0) {
      return res.status(400).json({ error: "Invalid cargo quantity" });
    }

    const quote = generateQuote({
      serviceType,
      vehicleType,
      cargoQuantity: parsedCargoQuantity,
      pickupLocation,
      deliveryLocation,
    });

    res.json({
      success: true,
      quote,
    });
  } catch (error) {
    logger.error('Error calculating quote:', error);
    res.status(500).json({ error: "Failed to calculate quote" });
  }
});

// Quote request endpoint
app.post("/api/quote", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      companyName,
      serviceType,
      pickupLocation,
      deliveryLocation,
      cargoDetails,
      scheduledDate,
      vehicleType = '16ft_truck',
    } = req.body;

    // Validate required fields
    const requiredFields = { name, email, pickupLocation, deliveryLocation, cargoDetails, scheduledDate };
    if (Object.values(requiredFields).some(field => !field)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Parse cargo quantity and validate
    const cargoQuantityMatch = cargoDetails.match(/(\d+)\s*(liters|kg|tons)/i);
    const cargoQuantity = cargoQuantityMatch ? parseInt(cargoQuantityMatch[1]) : 1000;
    if (isNaN(cargoQuantity) || cargoQuantity <= 0) {
      return res.status(400).json({ error: "Invalid cargo quantity" });
    }

    // Generate quote with dynamic factors
    const quote = generateQuote({ serviceType, vehicleType, cargoQuantity, pickupLocation, deliveryLocation });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      cc: process.env.RECIPIENT_EMAIL,
      subject: "Your Transportation Quote - Jagdamba Transport Services",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #6A1B9A;">Transportation Quote</h2>
          <p>Dear ${name},</p>
          <p>Thank you for your interest in Jagdamba Transport Services. Here's your quote (generated at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}):</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Quote Details</h3>
            <p><strong>Service Type:</strong> ${serviceType}</p>
            <p><strong>Vehicle Type:</strong> ${vehicleType}</p>
            <p><strong>From:</strong> ${pickupLocation}</p>
            <p><strong>To:</strong> ${deliveryLocation}</p>
            <p><strong>Cargo:</strong> ${cargoDetails}</p>
            <p><strong>Scheduled Date:</strong> ${new Date(scheduledDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <hr style="margin: 20px 0;">
            <h3 style="color: #F57C00;">Estimated Cost: ₹${quote.totalAmount}</h3>
            <p><small>Breakdown: Base ₹${quote.baseRate}, Vehicle ₹${quote.vehicleRate}, Distance ₹${quote.distanceRate}, Cargo ₹${quote.cargoRate}, Fuel ₹${quote.fuelSurcharge}, Insurance ₹${quote.insurance}, Tax ₹${quote.tax}</small></p>
            <p><small>*Pricing valid until ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}</small></p>
          </div>
          
          <p>To proceed with booking or for further details, contact us:</p>
          <p>📞 +91 8118867247<br>📧 contact@jagdambatransport.com</p>
          
          <p>Best regards,<br>Jagdamba Transport Services Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info('Quote email sent:', { email, quoteId: quote.quoteId });

    res.json({
      success: true,
      message: "Quote sent successfully!",
      quote,
    });
  } catch (error) {
    logger.error('Error generating quote:', error);
    res.status(500).json({ error: "Failed to generate quote" });
  }
});

// Dashboard stats endpoint
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const { default: Booking } = await import('./models/Booking.js');
    const { default: Vehicle } = await import('./models/Vehicle.js');
    const { default: User } = await import('./models/User.js');

    const [
      totalBookings,
      activeBookings,
      totalVehicles,
      availableVehicles,
      totalCustomers,
      revenueData,
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['assigned', 'in_transit'] } }),
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ status: 'available' }),
      User.countDocuments({ role: 'customer' }),
      Booking.aggregate([
        { $match: { status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalBookings,
        activeBookings,
        totalVehicles,
        availableVehicles,
        totalCustomers,
        totalRevenue: revenueData[0]?.total || 0,
      },
    });
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Jagdamba Transport Services API is running',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    uptime: process.uptime(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`🚀 JTS Server running on port ${PORT} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  logger.info(`📊 Healthcheck: http://localhost:${PORT}/api/health`);
});

// Helper function to generate quote
function generateQuote({ serviceType, vehicleType, cargoQuantity, pickupLocation, deliveryLocation }) {
  const baseRates = {
    bulk_transport: 8000,
    cold_chain: 12000,
    express_delivery: 18000,
    scheduled_pickup: 10000,
  };

  const vehicleRates = {
    '16ft_truck': 1.2,
    '19ft_truck': 1.5,
    'pickup_truck': 1.1,
    'refrigerated_truck': 2.0,
  };

  const distanceMatrix = {
    'Delhi-Jaipur': 300,
    'Delhi-Mumbai': 1400,
    'Mumbai-Pune': 150,
    'Delhi-Chennai': 2180,
    'Mumbai-Delhi': 1400,
  };

  const distanceKey = `${pickupLocation}-${deliveryLocation}`;
  const reverseKey = `${deliveryLocation}-${pickupLocation}`;
  const distanceKm = distanceMatrix[distanceKey] || distanceMatrix[reverseKey] || 500;

  const distanceRate = distanceKm * 2; // ₹2/km
  const baseRate = baseRates[serviceType] || 8000;
  const vehicleMultiplier = vehicleRates[vehicleType] || 1;
  const vehicleRate = baseRate * vehicleMultiplier - baseRate;
  const cargoRate = cargoQuantity * 0.5; // ₹0.5 per liter/kg
  const fuelSurcharge = cargoQuantity * 0.2; // ₹0.20 per liter/kg
  const insurance = cargoQuantity * 0.25; // ₹0.25 per unit

  const subtotal = baseRate + vehicleRate + distanceRate + cargoRate + fuelSurcharge + insurance;
  const tax = subtotal * 0.18;
  const totalAmount = Math.round(subtotal + tax);

  return {
    quoteId: `QUOTE-${Date.now()}`,
    baseRate: Math.round(baseRate),
    vehicleRate: Math.round(vehicleRate),
    distanceRate: Math.round(distanceRate),
    cargoRate: Math.round(cargoRate),
    fuelSurcharge: Math.round(fuelSurcharge),
    insurance: Math.round(insurance),
    subtotal: Math.round(subtotal),
    tax: Math.round(tax),
    totalAmount,
    createdAt: new Date().toISOString(),
  };
}

export default app;