import { Router } from 'express'
import { usersController } from './container'

const usersRouter = Router()

usersRouter.get('/:id', usersController.show)
usersRouter.put('/:id', usersController.update)
usersRouter.delete('/:id', usersController.delete)

export { usersRouter }
