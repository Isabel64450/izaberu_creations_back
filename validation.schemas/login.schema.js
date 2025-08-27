import Joi from 'joi';

const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Adresse email invalide',
    'any.required': 'L’email est requis',
    'string.empty': 'L’email est requis',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est requis',
    'string.empty': 'Le mot de passe est requis',
  }),
});

export default loginUserSchema;