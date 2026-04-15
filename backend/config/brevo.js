import nodemailer from 'nodemailer';

// Create the transporter using your Brevo SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ EXPORT FUNCTION
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Expense Tracker" <${process.env.SENDER_EMAIL}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log("✅ Email sent successfully! ID:", info.messageId);
    return info;

  } catch (err) {
    console.error("❌ Email Error (Nodemailer):", err.message);
    throw err; 
  }
};