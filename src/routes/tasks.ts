import { Router } from 'express'
import { usersController } from './container'
import { verifyToken } from '../middlewares/verify-token-middleware'

const tasksRouter = Router()

tasksRouter.get('/', verifyToken, usersController.index)
tasksRouter.get('/:taskId', verifyToken, usersController.show)
tasksRouter.post('/', verifyToken, usersController.save)
tasksRouter.put('/:taskId', verifyToken, usersController.update)
tasksRouter.delete('/:taskId', verifyToken, usersController.delete)
tasksRouter.delete('/:taskId/delete-all', verifyToken, usersController.delete)

export { tasksRouter }
