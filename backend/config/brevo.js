// backend/config/brevo.js
import * as Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

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

    // In the new SDK, we pass a plain object that matches the SendSmtpEmail interface
    const sendSmtpEmail = {
      subject: subject,
      htmlContent: htmlContent,
      sender: { name: "Forever App", email: senderEmail },
      to: [{ email: to }],
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error("❌ Email send failed:");
    // Log the specific error message from Brevo's API if available
    console.error(error?.response?.body || error.message || error);
    throw error;
  }
};