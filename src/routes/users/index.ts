import { Router } from 'express'
import { verifyToken as verify } from '../../middlewares/auth'
import { usersController } from '../container'

const usersRouter = Router()

usersRouter.get('/:id', verify, usersController.show)
usersRouter.put('/:id', verify, usersController.update)
usersRouter.delete('/:id', verify, usersController.delete)

export { usersRouter }
