import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

console.log(process.env.GMAIL_USER)
console.log(process.env.GMAIL_APP_PASSWORD)

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
        
    }
})
console.log("Email:", process.env.GMAIL_USER);
        console.log("Mot de passe (4 derniers caractères) :", process.env.GMAIL_APP_PASS?.slice(-4));
export default async function sendEmail({to, subject,html}) {
    try{
        const info= await transporter.sendMail({
            from: `${process.env.GMAIL_NAME} <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        })
        console.log('Email envoyé avec succès:', info.response);
    } catch(error){
        console.error('Erreur lors de l\'envoi de l\'email:', error); 
        throw new Error('Erreur lors de l\'envoi de l\'email');
    }
    
}

export function generateVerificationToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
}