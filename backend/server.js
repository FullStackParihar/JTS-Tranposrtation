import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

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
        console.error('SMTP connection error:', error);
    } else {
        console.log('Server is ready to send emails ✅');
    }
});

// Contact form endpoint
app.post("/send", async (req, res) => {
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
        subject: "New Contact Form Submission",
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h2>New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("MongoDB Connection Error ❌", err));

// Basic route
app.get('/', (req, res) => {
    res.send('Email server is running 🚀');
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));

console.log("MongoDB URI:", process.env.MONGO_URI);










































// // Import required packages
// import dotenv from "dotenv";
// dotenv.config();
 
// import express from 'express';
// import cors from 'cors';
// import nodemailer from 'nodemailer';
    

// import mongoose from 'mongoose';



// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Nodemailer setup with better error handling
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Verify transporter connection
// transporter.verify((error, success) => {
//     if (error) {
//         console.error('SMTP connection error:', error);
//     } else {
//         console.log('Server is ready to send emails');
//     }
// });

// // Contact form endpoint
// app.post("/send", async (req, res) => {
//     const { name, email, message } = req.body;

//     // Input validation
//     if (!name || !email || !message) {
//         return res.status(400).json({ error: "All fields are required" });
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         return res.status(400).json({ error: "Invalid email format" });
//     }

//     // Prepare email options
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER, // Use environment variable
//         subject: "New Contact Form Submission",
//         text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//         html: `
//       <h2>New Contact Form Submission</h2>
//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Message:</strong> ${message}</p>
//     `,
//     };

//     try {
//         // Send email
//         const info = await transporter.sendMail(mailOptions);
//         console.log('Email sent:', info.messageId);
//         res.status(200).json({ success: "Message sent successfully!" });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({
//             error: "Failed to send message",
//             details: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// });

// // Basic route for testing
// app.get('/', (req, res) => {
//     res.send('Email server is running');
// });

// // Start server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// // For testing the email functionality
// if (process.env.NODE_ENV === 'development') {
//     console.log('Running in development mode');
//     // Uncomment to test email sending
//     //   const testEmail = async () => {
//     //     try {
//     //       await transporter.sendMail({
//     //         from: process.env.EMAIL_USER,
//     //         to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
//     //         subject: 'Test Email',
//     //         text: 'This is a test email from your server'
//     //       });
//     //       console.log('Test email sent successfully');
//     //     } catch (error) {
//     //       console.error('Test email failed:', error);
//     //     }
//     //   };
//     //   testEmail();
// }

 

// mongoose.connect('mongodb+srv://vishnu:1234@cluster0.mongodb.net/quotationDB?retryWrites=true&w=majority', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("MongoDB Connected ✅"))
// .catch(err => console.log("MongoDB Connection Error ❌", err));
