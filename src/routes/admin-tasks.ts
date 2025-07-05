import { Router } from 'express'
import { tasksController } from './container'

const router = Router()

router.get('/', tasksController.index)
router.get('/:taskId', tasksController.show)
router.post('/', tasksController.save)
router.put('/:taskId', tasksController.update)
router.delete('/:taskId', tasksController.delete)
router.delete('/delete-all', tasksController.deleteAll)

export { router as adminTasksRouter }
