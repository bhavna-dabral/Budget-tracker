// backend/config/brevo.js
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Initialize the API instance directly from the named export
const apiInstance = new TransactionalEmailsApi();

// Set the API Key
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey, 
  process.env.BREVO_API_KEY
);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || "no-reply@example.com";

    // Use a plain object for the email data - the SDK accepts this 
    // and it avoids class constructor issues entirely.
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