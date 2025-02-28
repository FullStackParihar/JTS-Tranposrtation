require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// check if env variables are loaded
console.log("email:", process.env.EMAIL_USER);

// nodemailer setup
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


app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "all fields are required" });
    }

    try {
        await transporter.sendMail({
            from: `"${name}" <${process.env.EMAIL_USER}>`,
            to: "vishnuparihar239925@gmail.com", // replace with your email
            subject: "new contact form submission",
            text: `name: ${name}\nemail: ${email}\nmessage: ${message}`,
        });
        res.status(200).json({ success: "message sent successfully!" });
    } catch (error) {
        console.error("email error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
