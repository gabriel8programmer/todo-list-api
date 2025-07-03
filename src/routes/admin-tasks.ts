import { Router } from 'express'
import { tasksController } from './container'

const adminTasksRouter = Router()

adminTasksRouter.get('/', tasksController.index)
adminTasksRouter.get('/:taskId', tasksController.show)
adminTasksRouter.post('/', tasksController.save)
adminTasksRouter.put('/:taskId', tasksController.update)
adminTasksRouter.delete('/:taskId', tasksController.delete)
adminTasksRouter.delete('/delete-all', tasksController.deleteAll)

export { adminTasksRouter }
