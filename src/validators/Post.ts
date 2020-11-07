import { body } from 'express-validator'

const cretePostValidators = [
  body('title').notEmpty().withMessage('O título é obrigatório'),
  body('title')
    .isLength({ min: 5 })
    .withMessage('Mínimo de 5 caracteres para o título'),
  body('description')
    .isLength({ min: 20 })
    .withMessage('Mínimo de 20 caracteres para a descrição')
]

export default {
  cretePostValidators
}
