import nodemailer from 'nodemailer';
import winston from 'winston';
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

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

// Helper function to generate quote
const generateQuote = ({ serviceType, vehicleType, cargoQuantity, pickupLocation, deliveryLocation }) => {
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
};

// Controller for calculating quote
export const calculateQuote = (req, res) => {
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
};

// Controller for requesting quote
export const requestQuote = async (req, res) => {
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
};