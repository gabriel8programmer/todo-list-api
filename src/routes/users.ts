import { Router } from 'express'
import { usersController } from './container'

const router = Router()

router.get('/:id', usersController.show)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.delete)
router.get('/:id/tasks', usersController.tasks)
router.get('/:id/tasks/:taskId', usersController.showTask)
router.post('/:id/tasks', usersController.addTask)
router.put('/:id/tasks/:taskId', usersController.updateTask)
router.delete('/:id/tasks/delete-all', usersController.removeAllTasks)
router.delete('/:id/tasks/:taskId', usersController.removeTask)

export { router as usersRouter }
