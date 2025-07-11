 

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { rateLimit } from 'express-rate-limit';
import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import vehicleRoutes from './routes/vehicles.js';
import quoteRoutes from './routes/quoteRoutes.js';
import driversRoutes from './routes/driver.js';

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
   origin: "*"
}));
app.use(limiter); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
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

// Routes
app.get('/', (req, res) => {
  console.log('hello')
  res.send('hello')
});
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api', quoteRoutes);
app.use('/api/drivers', driversRoutes);

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
// app.use((err, req, res, next) => {
//   logger.error('Unhandled error:', err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// 404 route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`🚀 JTS Server running on port ${PORT} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  logger.info(`📊 Healthcheck: http://localhost:${PORT}/api/health`);
});

export default app;