import { Router } from 'express'
import crypto from 'crypto'
import path from 'path'
import UserController from './controllers/UserController'
import PostController from './controllers/PostController'
import multer from 'multer'

import multerConfig from './config/multer'
import Auth from './middleware/Auth'

import UserValidations from './validators/User'
import PostValidations from './validators/Post'

const routes = Router()

routes.get('/', (req, res) => {
  res.send('Projeto Web 2')
})

routes.get('/user', Auth, UserController.show)
routes.post(
  '/authenticate',
  UserValidations.LoginUserValidator,
  UserController.authenticate
)
routes.post(
  '/register',
  UserValidations.CreateUserValidator,
  UserController.store
)

routes.post(
  '/post',
  Auth,
  PostValidations.cretePostValidators,
  PostController.store
)

routes.get('/post', Auth, PostController.show)

routes.put(
  '/post/:id',
  Auth,
  PostValidations.cretePostValidators,
  PostController.update
)

routes.delete('/post/:id', Auth, PostController.delete)

routes.post(
  '/upload',
  multer({
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
      destination: (req, res, cb) => {
        cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
      },
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err, file.originalname)

          const fileName = `${hash.toString('hex')}-${file.originalname}`

          cb(null, fileName)
        })
      }
    }),
    limits: {
      fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif'
      ]

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('Invalid file type.'))
      }
    }
  }).single('file'),
  (req, res) => {
    return res.json({
      img_url: `${process.env.BASE_URL}/uploads/${req.file.filename}`
    })
  }
)

routes.use('/uploads/:id', (req, res) =>
  res.sendFile(path.join(__dirname, `../tmp/uploads/${req.params.id}`))
)

export default routes
