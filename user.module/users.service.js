import UserRepository from "./user.repository.js";
import addressRepository from "../address.module/address.repository.js";
import orderService from "../orders.module/orders.service.js";
import argon2 from "argon2"
import sendEmail from '../utils.de.auth/sendEmail.js'
import { generateVerificationToken } from "../utils.de.auth/sendEmail.js";
import jwt from 'jsonwebtoken'
import crypto from 'crypto';
class UserService{
  constructor(userRepository, addressRepository, orderService){
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.orderService = orderService;
  }
async registerUser(userData) {
  const { userName, userLastName, userEmail, password,confirmPassword,number,street,complement,city,postalCode }= userData
  const existingUser = await this.userRepository.getUserByEmail(userEmail);
  console.log("existingUser =", existingUser);
  if (existingUser) {
    throw new Error("L'utilisateur existe déjà");
  }

  const hashedPassword = await argon2.hash(password);
const addressData = {number, street, complement,city,postalCode, type:'main'}

  const mainAddressId = await this.addressRepository.createAddress(addressData);

   console.log("mainAddress =", mainAddressId);
  const deliveryAddressId = await this.addressRepository.createAddress({...addressData, type: 'delivery'});
  console.log("deliveryAddress =", deliveryAddressId);
  if (!mainAddressId ||!deliveryAddressId) {
    throw new Error("Adresse principale ou adresse de livraison invalide");
  }

  
  const newUser = {
    userName,
    userLastName,
    userEmail,
    password: hashedPassword,
    adress_delivery: deliveryAddressId
  };
const userId = await this.userRepository.createUser(newUser);
console.log('Données user pour createUser:', {
  userName,
  userLastName,
  userEmail,
  password: hashedPassword,
  adress_delivery: deliveryAddressId,
  
});

    

const verificationToken = jwt.sign({
      id: userId
    },
  process.env.JWT_SECRET,
{expiresIn: '1d'})
const CLIENT_URL = process.env.CLIENT_URL;

const verificationUrl = `${CLIENT_URL}/users/verify/${verificationToken}`
try{
  console.log("Envoi de mail en cours vers :", userEmail);
await sendEmail({
  to: userEmail,
  subject: 'Verification de votre compte',
  html: `Bonjour ${userName},<br><br>
      Veuillez cliquer sur le lien suivant pour vérifier votre compte : 
      <a href="${verificationUrl}">Vérifier mon compte</a><br><br>
      Si vous n'avez pas créé ce compte, veuillez ignorer cet email.`

})
}
catch(emailError)
{console.error('Erreur lors de l’envoi de l’email de vérification :', emailError);}
return {success: true,
    message: 'Utilisateur créé avec succès. Vérifiez votre email.'
  };
  }


 
   
async findUserById(userId) {
  console.log("ID reçu dans le service:", userId);
  return await this.userRepository.getUserById(userId);
}



async markUserAsVerified(userId) {
  return await this.userRepository.markUserAsVerified(userId);
}







async loginUser(email, password){
    const user = await this.userRepository.getUserByEmail(email)
    
    if(!user) throw new Error("Une erreur s'est produite : l'adresse e-mail et/ou le mot de passe ne correspondent pas.")
if (!user.isVerified) {
      throw new Error('Veuillez vérifier votre email avant de vous connecter');
    }
    const validPassword = await argon2.verify(user.password,password) 

if(!validPassword) throw new Error("Une erreur s'est produite : l'adresse e-mail et/ou le mot de passe ne correspondent pas.")  
   
  const token = jwt.sign(
      { id: user.id || user.customer_id,
        name: user.userName,
        email: email,
       },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );   
return {
      token,
      user: {
        id: user.id||user.customer_id,
        name: user.userName,
              
        email: user.userEmail,
      }
}}

async getCurrentUser(id){
  
  const user = await this.userRepository.getUserById(id);
  if (!user) throw new Error("Utilisateur non trouvé");
  return {
    id: user.id || user.customer_id,
    name: user.userName,
    email: user.userEmail
  };
}

async requestPasswordReset(email) {
  const user = await this.userRepository.getUserByEmail(email);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  await this.userRepository.savePasswordResetToken(user.customer_id, resetToken);

  const CLIENT_FRONT = process.env.CLIENT_FRONT;
  const resetUrl = `${CLIENT_FRONT}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.userEmail,
    subject: 'Réinitialisation de mot de passe',
    html: `Bonjour ${user.userName},<br><br>
      Cliquez ici pour réinitialiser votre mot de passe : 
      <a href="${resetUrl}">Réinitialiser</a><br><br>
      Ce lien expire dans 1 heure.`,
  });

  return { message: 'Email envoyé avec succès' };
}
async resetPassword(token, password, confirmPassword) {
  if (!password || !confirmPassword) {
    throw new Error('Veuillez fournir un mot de passe et sa confirmation');
  }

  if (password !== confirmPassword) {
    throw new Error('Les mots de passe doivent être identiques');
  }

  const user = await this.userRepository.getUserByResetToken(token);
  if (!user) {
    throw new Error('Token invalide ou expiré');
  }

  await this.userRepository.updateUserPassword(user.customer_id, password);
  return { message: 'Mot de passe réinitialisé avec succès' };
}




}
export default  UserService