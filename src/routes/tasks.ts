import { Router } from 'express'
import { usersController } from './container'

const tasksRouter = Router()

tasksRouter.get('/', usersController.index)
tasksRouter.get('/:taskId', usersController.show)
tasksRouter.post('/', usersController.save)
tasksRouter.put('/:taskId', usersController.update)
tasksRouter.delete('/:taskId', usersController.delete)
tasksRouter.delete('/:taskId/delete-all', usersController.delete)

export { tasksRouter }
