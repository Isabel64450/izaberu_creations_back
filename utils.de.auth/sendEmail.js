import Brevo from '@brevo/mail';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()
const client = new Brevo.Client({ apiKey: process.env.BREVO_API_KEY });
console.log('doutis de send mail '+ process.env.BREVO_USER)
console.log(process.env.BREVO_API_KEY)

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth:{
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_API_KEY,
        
    }
})
console.log("HOST ACTUEL:", transporter.options.host)
transporter.verify(function(error, success) {
   if (error) {
      console.log(" Connexion SMTP échouée:", error);
   } else {
      console.log("Serveur SMTP prêt");
   }
});
console.log("Email:", process.env.BREVO_USER);
        console.log("Mot de passe (4 derniers caractères) :", process.env.BREVO_API_KEY?.slice(-4));
export default async function sendEmail({to, subject,html}) {
    try{
        const info= await transporter.sendMail({
            from: `${process.env.BREVO_NAME} <${process.env.BREVO_USER}>`,
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

if (process.argv[1].includes("sendEmail")) {
  sendEmail({
    to: process.env.BREVO_USER, 
    subject: "Test Brevo",
    html: "<h1>Test réussi </h1>"
  });
}