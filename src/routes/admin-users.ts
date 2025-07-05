import { Router } from 'express'
import { usersController } from './container'

const router = Router()

router.get('/', usersController.index)
router.get('/:id', usersController.show)
router.post('/', usersController.save)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.delete)
router.delete('/delete-all', usersController.deleteAll)

export { router as adminUsersRouter }
