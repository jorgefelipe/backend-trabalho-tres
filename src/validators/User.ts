import { body } from 'express-validator'

const CreateUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Mínimo de 8 caracteres para a senha'),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Minimo de 3 caracteres para o nome')
]

const LoginUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Mínimo de 8 caracteres para a senha')

]

export default {
  CreateUserValidator,
  LoginUserValidator
}
