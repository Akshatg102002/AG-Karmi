import { Booking, User } from '../types';

/**
 * =============================================================================
 * PRODUCTION-READY EMAIL SERVICE
 * =============================================================================
 * This service is now configured to send email data to a secure backend API
 * endpoint (`/api/send-email`). This is the standard, secure method for
 * handling email operations.
 *
 * The actual email sending logic, including the use of secret SMTP credentials,
 * should be handled on the backend. An example of this backend function can be
 * found in `/functions/sendEmail.js`.
 *
 * The `console.log` fallback is retained to ensure that the email content
 * is still visible for testing in a development environment where the
 * backend function may not be running.
 * =============================================================================
 */


// --- Helper function to send email data to the backend ---
export const sendEmail = async (to: string, subject: string, htmlBody: string): Promise<void> => {
    try {
        // In a production environment, this would be the URL of your deployed function.
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, subject, htmlBody }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API call to send email failed');
        }

        console.log(`[Email Service] Successfully sent request to /api/send-email for recipient: ${to}`);

    } catch (error) {
        console.error("Could not reach the backend email service. Falling back to console simulation.", error);
        // Fallback to console logging for development environments
        console.log(`
      ===============================================================
      [Email Simulation - Backend Unreachable]
      ---------------------------------------------------------------
      TO: ${to}
      SUBJECT: ${subject}
      ---------------------------------------------------------------
      BODY (HTML):
      ${htmlBody}
      ===============================================================
    `);
    }
};


// --- Email Template Generation (No changes needed here) ---

const SALON_NAME = "Karmi Beauty Salon";
const SALON_ADDRESS = "147-13 Jamaica Avenue, New York, NY";
const SALON_PHONE = "(123) 456-7890";
const BRAND_PRIMARY_COLOR = '#D97706'; // Amber 600
const BRAND_DARK_COLOR = '#78350F'; // Amber 900
const BRAND_TEXT_COLOR = '#44403C'; // Stone 700

const createBaseTemplate = (title: string, content: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { margin: 0; padding: 0; font-family: 'Inter', sans-serif, Arial, Helvetica; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background-color: ${BRAND_DARK_COLOR}; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; color: ${BRAND_TEXT_COLOR}; line-height: 1.6; }
            .content h2 { color: ${BRAND_PRIMARY_COLOR}; font-size: 20px; }
            .button { display: inline-block; background-color: ${BRAND_PRIMARY_COLOR}; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 20px; }
            .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; }
            .booking-details { border: 1px solid #eaeaea; border-radius: 5px; padding: 20px; margin-top: 20px; background-color: #fafafa; }
            .booking-details p { margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${SALON_NAME}</h1>
            </div>
            <div class="content">
                <h2>${title}</h2>
                ${content}
            </div>
            <div class="footer">
                <p>${SALON_NAME}</p>
                <p>${SALON_ADDRESS}</p>
                <p>${SALON_PHONE}</p>
            </div>
        </div>
    </body>
    </html>
    `;
};


export const createWelcomeEmailTemplate = (userName: string): { subject: string; htmlBody: string } => {
    const subject = `Welcome to ${SALON_NAME}!`;
    const content = `
        <p>Hi ${userName},</p>
        <p>We're so excited to have you join us. Get ready to experience top-tier beauty and relaxation services.</p>
        <p>You can now manage your profile and book your next appointment with ease.</p>
        <a href="#" class="button">Book Your First Appointment</a>
    `;
    const htmlBody = createBaseTemplate("Welcome Aboard!", content);
    return { subject, htmlBody };
};

const formatBookingDetails = (booking: Booking): string => `
    <div class="booking-details">
        <p><strong>Service:</strong> ${booking.serviceName} (${booking.variantName})</p>
        <p><strong>Date:</strong> ${new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
        <p><strong>Time:</strong> ${booking.appointmentTime}</p>
        <p><strong>Stylist:</strong> ${booking.employeeName}</p>
        <p><strong>Price:</strong> $${booking.price.toFixed(2)} (${booking.paymentStatus})</p>
    </div>
`;

export const createBookingConfirmationTemplate = (booking: Booking, user: User, role: 'customer' | 'employee' | 'admin'): { subject: string; htmlBody: string } => {
    let subject = '';
    let title = '';
    let content = '';

    switch (role) {
        case 'customer':
            subject = `Your Appointment is Confirmed! - ${SALON_NAME}`;
            title = 'Your Booking is Confirmed!';
            content = `
                <p>Hi ${user.name},</p>
                <p>Thank you for booking with us. We've confirmed your appointment and look forward to seeing you!</p>
                ${formatBookingDetails(booking)}
                <a href="#" class="button">Manage My Bookings</a>
            `;
            break;
        case 'employee':
            subject = `New Appointment Assigned: ${booking.serviceName} at ${booking.appointmentTime}`;
            title = 'New Appointment Assigned';
            content = `
                <p>Hi ${user.name},</p>
                <p>A new appointment has been added to your schedule for <strong>${booking.customerInfo.fullName}</strong>.</p>
                ${formatBookingDetails(booking)}
                 <a href="#" class="button">View My Schedule</a>
            `;
            break;
        case 'admin':
            subject = `[Admin] New Booking: ${booking.serviceName} for ${booking.customerInfo.fullName}`;
            title = 'New Booking Alert';
            content = `
                <p>A new appointment has been booked by <strong>${booking.customerInfo.fullName}</strong> with <strong>${booking.employeeName}</strong>.</p>
                ${formatBookingDetails(booking)}
                <a href="#" class="button">View Admin Calendar</a>
            `;
            break;
    }

    const htmlBody = createBaseTemplate(title, content);
    return { subject, htmlBody };
};


export const createCancellationNotificationTemplate = (booking: Booking, user: User, role: 'customer' | 'employee' | 'admin'): { subject: string; htmlBody: string } => {
    let subject = '';
    let title = '';
    let content = '';

    switch (role) {
        case 'customer':
            subject = `Your Appointment has been Cancelled - ${SALON_NAME}`;
            title = 'Appointment Cancelled';
            content = `
                <p>Hi ${user.name},</p>
                <p>This is a confirmation that your appointment has been successfully cancelled. We hope to see you again soon.</p>
                ${formatBookingDetails(booking)}
                <a href="#" class="button">Book a New Appointment</a>
            `;
            break;
        case 'employee':
            subject = `Appointment Cancelled: ${booking.serviceName} at ${booking.appointmentTime}`;
            title = 'An Appointment Was Cancelled';
            content = `
                <p>Hi ${user.name},</p>
                <p>The following appointment for <strong>${booking.customerInfo.fullName}</strong> has been cancelled and removed from your schedule.</p>
                ${formatBookingDetails(booking)}
            `;
            break;
        case 'admin':
            subject = `[Admin] Booking Cancelled: ${booking.serviceName} for ${booking.customerInfo.fullName}`;
            title = 'Booking Cancellation Alert';
            content = `
                <p>An appointment booked by <strong>${booking.customerInfo.fullName}</strong> with <strong>${booking.employeeName}</strong> has been cancelled.</p>
                ${formatBookingDetails(booking)}
            `;
            break;
    }

    const htmlBody = createBaseTemplate(title, content);
    return { subject, htmlBody };
};
