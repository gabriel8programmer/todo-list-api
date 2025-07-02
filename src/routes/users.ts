import { Router } from 'express'
import { usersController } from './container'
import { verifyToken } from '../middlewares/verify-token-middleware'

const usersRouter = Router()

usersRouter.get('/:id', verifyToken, usersController.show)
usersRouter.put('/:id', verifyToken, usersController.update)
usersRouter.delete('/:id', verifyToken, usersController.delete)

export { usersRouter }
