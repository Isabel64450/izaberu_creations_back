

import jwt from "jsonwebtoken"
class UserController {
  constructor(userService){
    this.userService=  userService;
  
  }
  async registerUser  (req, res) {
    try {
       


      const {
        userName,
        userLastName,
        userEmail,
        password,
        confirmPassword,
        number,
        street,
        complement,
        city,
        postalCode,
      } = req.body;

if (
      !userName || !userLastName || !userEmail || !password || !confirmPassword ||
      !number || !street || !city || !postalCode
    ) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }


if(password !==confirmPassword){
    return res.status(400).json({ message: 'Les mots de passe doivent être identiques' })
  }

      const result = await this.userService.registerUser({
        userName,
        userLastName,
        userEmail,
        password,
        
        number,
        street,
        complement,
        city,
        postalCode,
      });

      return res.status(201).json({
        message: "Utilisateur créé avec succès. Vérifiez votre email."
        
      });
    } catch (error) {
      console.error('Erreur dans registerUser:', error);
      res.status(400).json({ error: error.message || 'Erreur inconnue'});
    }
  }
  
  async loginUser(req, res) {
  try {
    
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const {token, user}=await this.userService.loginUser(email, password)
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      maxAge: 3600000 
    })
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    return res.json({message:'Connexion réussie', user,token})    
      
  } catch (err) {
    console.error("Erreur de connexion :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}  

async getCurrentUser(req, res){
  try{
    
    const user = await this.userService.getCurrentUser(req.user.id)
    return res.status(200).json(user)

  }catch(err){
    
    res.status(401).json({message:"Authentification invalide"})
  }
}

async logoutUser(req, res) {
  try {
    res.clearCookie('token'); 
    res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (err) {
    console.error('Erreur lors de la déconnexion:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}










async verifyEmail(req, res) {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded token dans controller:", decoded); 
    if (!decoded.id) {
      return res.status(400).json({ message: 'Token invalide' });
    }

   
    const user = await this.userService.findUserById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Votre compte est déjà vérifié' })
     
     
    }
 await this.userService.markUserAsVerified(user.customer_id);
    
    
 res.json({ message: 'Votre compte a été vérifié avec succès' });
   

  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    return res.status(500).json({ message: 'Erreur lors de la vérification de l\'email'})
  }
}

async requestPasswordReset(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Veuillez fournir un email' });
  }

  try {
    const result = await this.userService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error('Erreur demande reset password :', error.message);
    res.status(500).json({ message: error.message });
  }
}


async resetPassword(req, res) {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    const result = await this.userService.resetPassword(token, password, confirmPassword);
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe :', error.message);
    res.status(400).json({ message: error.message });
  }
}





}




export default UserController;