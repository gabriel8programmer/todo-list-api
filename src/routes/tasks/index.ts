import { Router } from 'express'
import { verifyToken as verify } from '../../middlewares/auth'
import { usersController } from '../container'

const tasksRouter = Router()

// USER ROUTES ONLY ADMINS
tasksRouter.get('/', verify, usersController.index)
tasksRouter.get('/:taskId', verify, usersController.show)
tasksRouter.post('/', verify, usersController.save)
tasksRouter.put('/:taskId', verify, usersController.update)
tasksRouter.delete('/:taskId', verify, usersController.delete)

export { tasksRouter }
