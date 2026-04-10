import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();


console.log('Détails de send mail:', process.env.BREVO_USER);


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // STARTTLS sera utilisé
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
    }
});


transporter.verify((error, success) => {
   if (error) {
      console.error(" Connexion SMTP échouée:", error);
   } else {
      console.log(" Serveur SMTP prêt !");
   }
});


export default async function sendEmail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.BREVO_NAME} <${process.env.BREVO_USER}>`,
            to:"isa.dumas64@gmail.com",
            subject:"Test brevo",
            html:"<h1>Test</h1>"
        });
        console.log('📧 Email envoyé avec succès:', info.response);
    } catch (error) {
        console.error(' Erreur lors de l\'envoi de l\'email:', error);
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
}


export function generateVerificationToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}


if (process.argv[1].includes("sendEmail")) {
  sendEmail({
    to: process.env.BREVO_USER, 
    subject: "Test Brevo",
    html: "<h1>Test SMTP réussi !</h1>"
  });
}