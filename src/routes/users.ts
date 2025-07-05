import { Router } from 'express'
import { usersController } from './container'

const usersRouter = Router()

usersRouter.get('/:id', usersController.show)
usersRouter.put('/:id', usersController.update)
usersRouter.delete('/:id', usersController.delete)
usersRouter.get('/:id/tasks', usersController.tasks)
usersRouter.get('/:id/tasks/:taskId', usersController.showTask)
usersRouter.post('/:id/tasks', usersController.addTask)
usersRouter.put('/:id/tasks/:taskId', usersController.updateTask)
usersRouter.delete('/:id/tasks/:taskId', usersController.removeTask)

export { usersRouter }
