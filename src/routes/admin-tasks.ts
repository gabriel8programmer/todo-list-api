import { Router } from 'express'
import { tasksController } from './container'

const router = Router()

router.get('/', tasksController.index)
router.get('/:taskId', tasksController.show)
router.post('/', tasksController.save)
router.put('/:taskId', tasksController.update)
router.delete('/delete-all', tasksController.deleteAll)
router.delete('/:taskId', tasksController.delete)

export { router as adminTasksRouter }
