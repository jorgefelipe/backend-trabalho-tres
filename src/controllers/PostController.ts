import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import Post from '../schemas/Post'
import { ITokenParams } from '../utils/functions'

class PostController {
  public async show (req: Request<ITokenParams>, res: Response) {
    try {
      const posts = await Post.find()

      res.status(200).send({
        code: 'post/show-successfully',
        message: 'Lista de post obtidas com sucesso',
        data: posts
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'post/show-error',
        message: 'Ocorreu um erro interno '
      })
    }
  }

  public async store (req: Request, res: Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(404).send({
          code: 'post/store-invalid-data',
          message: errors.array()[0].msg
        })
      }
      const post = await Post.create(req.body)

      res.status(200).send({
        code: 'post/store-successfully',
        message: 'Post criado com sucesso',
        data: post
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'post/store-error',
        message: 'Ocorreu um erro interno ao tentar criar o novo post'
      })
    }
  }

  public async update (req: Request, res: Response) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(404).send({
          code: 'post/update-invalid-data',
          message: errors.array()[0].msg
        })
      }

      await Post.update({ _id: req.params.id }, { ...req.body })

      res.status(200).send({
        code: 'post/update-successfully',
        message: 'Post atualizado com sucesso'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'post/update-error',
        message: 'Ocorreu um erro interno ao tentar atualiza o post'
      })
    }
  }

  public async delete (req: Request<any>, res: Response) {
    try {
      await Post.deleteOne({ _id: req.params.id })

      res.status(200).send({
        code: 'post/delete-successfully',
        message: 'Post excluído com sucesso'
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        code: 'post/delete-error',
        message: 'Ocorreu um erro interno ao tentar excluir o post'
      })
    }
  }
}

export default new PostController()
