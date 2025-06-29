const jwt = require('jsonwebtoken');

// Mock user database (replace with a real database)
const users = {
    'user1@example.com': { id: 1, name: 'Sample User', email: 'user1@example.com' }
};

// Mock quotes storage (replace with a database)
let quotes = [];

// Secret key for JWT (replace with a secure key in production)
const JWT_SECRET = 'your-secure-jwt-secret';

// Quote generation logic (simplified)
const generateQuote = (req, res) => {
    const { name, email, phone, companyName, serviceType, pickupLocation, deliveryLocation, cargoDetails, scheduledDate } = req.body;

    // Validate required fields
    if (!name || !email || !pickupLocation || !deliveryLocation || !cargoDetails || !scheduledDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Simulate user lookup (replace with real database query)
    const user = users[req.user.email];
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Generate quote
    const baseCost = 500; // Base cost in rupees
    const distanceFactor = pickupLocation === 'Delhi' && deliveryLocation === 'Mumbai' ? 1000 : 500;
    const cargoQuantity = parseInt(cargoDetails.split(' ')[0]) || 1000; // Assume first number is quantity
    const totalAmount = Math.round(baseCost + distanceFactor + (cargoQuantity * 0.5)); // Simple pricing logic

    const quote = {
        quoteId: `QUOTE-${Date.now()}`,
        totalAmount,
        details: {
            name,
            email,
            phone,
            companyName,
            serviceType,
            pickupLocation,
            deliveryLocation,
            cargoDetails,
            scheduledDate
        },
        createdAt: new Date().toISOString(),
        userId: user.id
    };

    // Store quote (in memory for now)
    quotes.push(quote);

    // Simulate email sending (replace with real email service)
    console.log(`Quote generated for ${email} at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}: ₹${totalAmount}. Details:`, quote.details);

    res.status(200).json({ success: true, quote });
};

module.exports = { generateQuote };