import { Router } from 'express'
import { tasksController } from './container'
import { ensureIsAdmin as isAdmin } from '../middlewares/ensure-is-admin-middleware'
import { verifyToken } from '../middlewares/verify-token-middleware'

const adminTasksRouter = Router()

adminTasksRouter.get('/', verifyToken, isAdmin, tasksController.index)
adminTasksRouter.get('/:taskId', verifyToken, isAdmin, tasksController.show)
adminTasksRouter.post('/', verifyToken, isAdmin, tasksController.save)
adminTasksRouter.put('/:taskId', verifyToken, isAdmin, tasksController.update)
adminTasksRouter.delete('/:taskId', verifyToken, isAdmin, tasksController.delete)
adminTasksRouter.delete('/delete-all', verifyToken, isAdmin, tasksController.deleteAll)

export { adminTasksRouter }
