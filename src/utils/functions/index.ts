import jwt from 'jsonwebtoken'

export interface ITokenParams {
    userId: string;
  }

export const generateToken = (params: ITokenParams): string =>
  jwt.sign(params, process.env.SECRET_KEY, {
    expiresIn: 86400 // token expire in one day
  })
