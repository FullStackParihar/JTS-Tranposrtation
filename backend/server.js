require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

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

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "your-email@example.com", // Replace with your email
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
