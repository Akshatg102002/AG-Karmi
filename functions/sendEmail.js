/**
 * =============================================================================
 * SECURE BACKEND EMAIL FUNCTION (EXAMPLE)
 * =============================================================================
 * This file is an example of a serverless function (e.g., for Firebase Cloud
 * Functions, Vercel, or Netlify) that securely sends emails.
 *
 * HOW TO USE THIS:
 * 1.  Set up a serverless function environment with your provider.
 * 2.  Install the required dependencies: `npm install nodemailer`
 * 3.  Deploy this function.
 * 4.  Set the following environment variables securely in your provider's
 *     dashboard (DO NOT hard-code them here):
 *     - SMTP_HOST: smtp-relay.brevo.com
 *     - SMTP_PORT: 587
 *     - SMTP_USER: 9aeb0b001@smtp-brevo.com
 *     - SMTP_PASS: RyZx914JM287OCnH
 *
 * This function creates an API endpoint at `/api/send-email` that your
 * frontend application can call.
 * =============================================================================
 */

// We use the `nodemailer` library to send emails.
const nodemailer = require('nodemailer');

// This is the main handler function for the serverless environment.
// It might look slightly different depending on your provider (e.g., Express app).
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, subject, htmlBody } = JSON.parse(event.body);

    // --- Nodemailer Transporter Configuration ---
    // This transporter uses your SMTP credentials, which should be stored
    // securely as environment variables, not in the code.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., 'smtp-relay.brevo.com'
      port: parseInt(process.env.SMTP_PORT || '587', 10), // e.g., 587
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Your Brevo login
        pass: process.env.SMTP_PASS, // Your Brevo password
      },
    });

    // --- Mail Options ---
    // Defines the sender, recipient, subject, and body of the email.
    const mailOptions = {
      from: `"Karmi Beauty Salon" <no-reply@karmisalon.com>`,
      to: to,
      subject: subject,
      html: htmlBody,
    };

    // --- Send the Email ---
    await transporter.sendMail(mailOptions);

    // Return a success response to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };

  } catch (error) {
    console.error('Email sending error:', error);
    // Return an error response to the frontend
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email.' }),
    };
  }
};
