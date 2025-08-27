import Joi from 'joi';

const registerUserSchema = Joi.object({
  userName: Joi.string().min(2).required().messages({
    'string.base': 'Le prénom doit être une chaîne de caractères',
    'string.empty': 'Le prénom est requis',
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'any.required': 'Le prénom est requis',
  }),

  userLastName: Joi.string().min(2).required().messages({
    'string.empty': 'Le nom de famille est requis',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
  }),

  userEmail: Joi.string().email().required().messages({
    'string.email': 'Adresse e-mail invalide',
    'any.required': 'L’email est requis',
  }),

  password: Joi.string().min(6).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
    'any.required': 'Le mot de passe est requis',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Les mots de passe doivent être identiques',
    'any.required': 'La confirmation du mot de passe est requise',
  }),

  number: Joi.string().required().messages({
    'string.empty': 'Le numéro de téléphone est requis',
    'any.required': 'Le numéro de téléphone est requis',
  }),

  street: Joi.string().required().messages({
    'string.empty': 'La rue est requise',
    'any.required': 'La rue est requise',
  }),

  complement: Joi.string().allow('', null), 

  city: Joi.string().required().messages({
    'string.empty': 'La ville est requise',
  }),

  postalCode: Joi.string().pattern(/^\d{5}$/).required().messages({
    'string.pattern.base': 'Le code postal doit contenir 5 chiffres',
    'any.required': 'Le code postal est requis',
  }),
});

export default registerUserSchema;