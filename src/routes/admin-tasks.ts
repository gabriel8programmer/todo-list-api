import { Router } from 'express'
import { isAdmin, verifyToken as verify } from '../middlewares/auth-middleware'
import { tasksController } from './container'

const adminTasksRouter = Router()

adminTasksRouter.get('/', verify, isAdmin, tasksController.index)
adminTasksRouter.get('/:taskId', verify, isAdmin, tasksController.show)
adminTasksRouter.post('/', verify, isAdmin, tasksController.save)
adminTasksRouter.put('/:taskId', verify, isAdmin, tasksController.update)
adminTasksRouter.delete('/:taskId', verify, isAdmin, tasksController.delete)
adminTasksRouter.delete('/delete-all', verify, isAdmin, tasksController.deleteAll)

export { adminTasksRouter }
