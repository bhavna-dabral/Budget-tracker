// backend/config/brevo.js
import * as SibApiV3Sdk from "@getbrevo/brevo"; // Use * as SibApiV3Sdk
import dotenv from "dotenv";

dotenv.config();

// Create the API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set the API Key
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL || "no-reply@example.com";

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // Use the class constructor

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: "Forever App", email: senderEmail };
    sendSmtpEmail.to = [{ email: to }];

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(`✅ Email sent successfully to: ${to}`);
    return response;
  } catch (error) {
    console.error("❌ Email send failed:");
    console.error(error?.response?.body || error.message || error);
    throw error;
  }
};