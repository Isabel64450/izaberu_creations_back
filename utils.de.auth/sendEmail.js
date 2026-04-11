import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();


const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export default async function sendEmail({ to, subject, html }) {
  try {
    const data = await tranEmailApi.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER, 
        name: process.env.BREVO_NAME
      },
      to: [{ email: to }],
      subject,
      htmlContent: html
    });

   

  } catch (error) {
    console.error("Erreur envoi email:", error);
    if (error.response) {
     
    }
    throw new Error("Erreur lors de l'envoi de l'email");
  }
}

export function generateVerificationToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}