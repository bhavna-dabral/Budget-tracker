// backend/config/brevo.js
import { createRequire } from 'module';
import dotenv from "dotenv";

const require = createRequire(import.meta.url);
const rawBrevo = require('@getbrevo/brevo');

// This line ensures we get the actual library, 
// whether Node wraps it in .default or not.
const Brevo = rawBrevo.default || rawBrevo;

dotenv.config();

// Initialize the API instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set the API Key
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || "no-reply@example.com";

    const sendSmtpEmail = {
      subject: subject,
      htmlContent: htmlContent,
      sender: { name: "Budget Tracker", email: senderEmail },
      to: [{ email: to }],
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error("❌ Email send failed:");
    console.error(error?.response?.body || error.message || error);
    throw error;
  }
};