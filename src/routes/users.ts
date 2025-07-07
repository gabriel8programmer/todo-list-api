import { Router } from 'express'
import { usersController, verifyToken as verify, verifyUserAccess as userAccess } from './container'

const router = Router()

router.get('/:id', verify, userAccess, usersController.show)
router.put('/:id', verify, userAccess, usersController.update)
router.delete('/:id', verify, userAccess, usersController.delete)
router.get('/:id/tasks', verify, userAccess, usersController.tasks)
router.get('/:id/tasks/:taskId', verify, userAccess, usersController.showTask)
router.post('/:id/tasks', verify, userAccess, usersController.addTask)
router.put('/:id/tasks/:taskId', verify, userAccess, usersController.updateTask)
router.delete('/:id/tasks/:taskId', verify, userAccess, usersController.removeTask)
router.delete('/:id/tasks/delete-all', verify, userAccess, usersController.removeAllTasks)

export { router as usersRouter }
