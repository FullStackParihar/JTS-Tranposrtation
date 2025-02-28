require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5001;  

app.use(express.json());
app.use(cors());

// Connect to MongoDB (JTS-ClientForm database)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Error:", err));


// Define Schema for contacts collection
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// Create model for contacts collection
const Contact = mongoose.model("Contact", contactSchema, "contacts");

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Store Data in MongoDB & Send Email
app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Save to MongoDB (Database: JTS-ClientForm, Collection: contacts)
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Send email notification
        await transporter.sendMail({
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: "vishnuparihar239925@gmail.com",
            subject: "New Contact Form Submission",
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });

        res.status(200).json({ success: "Message saved and email sent!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
