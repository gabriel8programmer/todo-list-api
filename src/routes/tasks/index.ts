import { Router } from 'express'
import { verifyToken as verify } from '../../middlewares/auth'
import { usersController } from '../container'

const tasksRouter = Router()

// USER ROUTES ONLY ADMINS
tasksRouter.get('/:id/tasks', verify, usersController.index)
tasksRouter.get('/:id/tasks/:taskId', verify, usersController.show)
tasksRouter.post('/:id/tasks', verify, usersController.save)
tasksRouter.put('/:id/tasks/:taskId', verify, usersController.update)
tasksRouter.delete('/:id/tasks/:taskId', verify, usersController.delete)

export { tasksRouter }
