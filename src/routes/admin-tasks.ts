import { Router } from 'express'
import { tasksController, verifyToken as verify, verifyAdmin as isAdmin } from './container'

const router = Router()

router.get('/', verify, isAdmin, tasksController.index)
router.get('/:taskId', verify, isAdmin, tasksController.show)
router.post('/', verify, isAdmin, tasksController.save)
router.put('/:taskId', verify, isAdmin, tasksController.update)
router.delete('/delete-all', verify, isAdmin, tasksController.deleteAll)
router.delete('/:taskId', verify, isAdmin, tasksController.delete)

export { router as adminTasksRouter }
