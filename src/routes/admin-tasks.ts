import { Router } from 'express'
import { tasksController } from './container'
import { ensureIsAdmin as isAdmin } from '../middlewares/ensure-is-admin-middleware'
import { verifyToken } from '../middlewares/verify-token-middleware'

const adminTasksRouter = Router()

adminTasksRouter.get('/', tasksController.index)
adminTasksRouter.get('/:taskId', tasksController.show)
adminTasksRouter.post('/', tasksController.save)
adminTasksRouter.put('/:taskId', tasksController.update)
adminTasksRouter.delete('/:taskId', tasksController.delete)
adminTasksRouter.delete('/delete-all', tasksController.deleteAll)

export { adminTasksRouter }
