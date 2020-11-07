import { Request, Response } from 'express'
import { IUser, IUserAuth } from '../models/User'
import { validationResult } from 'express-validator'
import { ITokenParams, generateToken } from '../utils/functions'

import bcrypt from 'bcryptjs'

import User from '../schemas/User'

class UserController {
  public async store (req: Request, res: Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(404).send({
          code: 'register/invalid-data',
          message: errors.array()[0].msg
        })
      }

      const { email } = req.body as IUser

      if (await User.findOne({ email })) {
        return res.status(400).send({
          code: 'register/email-already-exists',
          message: 'Email já cadastrado.'
        })
      }
      await User.create(req.body)

      return res.status(200).send({
        code: 'register/succesfully',
        message: 'Cadastro realizado com sucesso!'
      })
    } catch (err) {
      console.log(err)
      return res.status(500).send({
        code: 'register/default-error',
        message: 'Ocorreu um erro interno ao tentar realizar o cadastro.'
      })
    }
  }

  public async show (req: Request<ITokenParams>, res: Response) {
    try {
      const id = req.params.userId
      const user = await User.findById(id)

      res.status(200).send({
        code: 'user/show-user-successfully',
        message: 'Dados do usuário obtido com sucesso',
        data: user
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'user/show-user-error',
        message: 'Ocorreu um erro interno ao tentar obter os dados do usuário'
      })
    }
  }

  public async authenticate (req: Request, res: Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(404).send({
          code: 'authenticate/invalid-data',
          message: errors.array()[0].msg
        })
      }
      const { email, password } = req.body as IUserAuth

      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(400).send({
          code: 'user/not-found',
          message: 'Usuário não encontrado'
        })
      }

      if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({
          code: 'user/invalid-data',
          message: 'Email e/ou senha incorretos'
        })
      }

      user.password = undefined

      const token = generateToken({ userId: user.id })

      return res.status(200).send({
        code: 'user/login-successfully',
        message: 'Login realizado com sucesso',
        data: { token, user }
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'user/authentication',
        message: 'Ocorreu um erro interno ao tentar realizar o login'
      })
    }
  }
}

export default new UserController()
