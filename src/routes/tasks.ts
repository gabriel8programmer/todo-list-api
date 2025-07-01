import { Router } from 'express'
import { verifyToken as verify } from '../middlewares/auth-middleware'
import { usersController } from './container'

const tasksRouter = Router()

tasksRouter.get('/', verify, usersController.index)
tasksRouter.get('/:taskId', verify, usersController.show)
tasksRouter.post('/', verify, usersController.save)
tasksRouter.put('/:taskId', verify, usersController.update)
tasksRouter.delete('/:taskId', verify, usersController.delete)
tasksRouter.delete('/:taskId/delete-all', verify, usersController.delete)

export { tasksRouter }
