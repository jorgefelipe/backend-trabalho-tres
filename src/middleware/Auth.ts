import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ITokenParams } from '../utils/functions'

export default function verifyJWT (
  req: Request<ITokenParams>,
  res: Response,
  next: NextFunction
): Response {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error('Token não informado.')

    const parts = authHeader.split(' ')
    if (parts.length !== 2) throw new Error('Token inválido.')

    const [scheme, token] = parts

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded: ITokenParams) => {
      if (err) throw new Error('Token inválido.')

      req.params.userId = decoded.userId
      next()
    })
  } catch (err) {
    return res
      .status(404)
      .send({
        code: 'jwt/verify',
        message: err.message
      })
  }
}
