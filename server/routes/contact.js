const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config(); 

router.post("/", async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // --- Nodemailer Setup --
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Nodemailer is not configured. Please set EMAIL_USER and EMAIL_PASS in .env");
        return res.status(500).json({ success: false, message: "Server mailer is not configured." });
    }
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, 
        replyTo: email, 
        to: process.env.EMAIL_USER,   
        subject: `New Wanderlust Support Request: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>New Message from Wanderlust Support Form</h2>
                <p>You have received a new message from your website's support form.</p>
                <hr>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <h3>Message:</h3>
                <p style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: "Thank you for your message! We will get back to you shortly." 
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ 
            success: false, 
            message: "Sorry, something went wrong on our end. Please try again later." 
        });
    }
});

module.exports = router;