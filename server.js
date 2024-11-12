const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');  
require('dotenv').config();  

const app = express();
const port = process.env.PORT ;  

// Enable CORS for all origins
app.use(cors());  

app.use(cors({ origin: '*' }));

// Middleware to parse JSON
app.use(bodyParser.json());

// Set up Nodemailer transporter using Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,  
        pass: process.env.GMAIL_PASS,  
    },
});

// Simple GET endpoint to check if server is running
app.get("/", (req, res) => {
    res.status(200).send("Hi, hello!! welcome ");
});

// POST endpoint for handling contact form submissions
app.post('/send-email', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Define the email content
    const mailOptions = {
        from: email,  
        to: process.env.RECIPIENT_EMAIL,  
        subject: 'Your Personal Portfoilo Contact Form',
        html: `
            <h3>Your Contact Form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Error sending email.' });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ success: true, message: 'Message sent successfully.' });
        }
    });
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} welcome to backend world`);
});
