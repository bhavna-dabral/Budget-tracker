// backend/config/brevo.js
import pkg from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

// Destructure the needed classes from the default package export
const { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } = pkg;

// Initialize the API instance
const apiInstance = new TransactionalEmailsApi();

// Set the API Key
apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
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