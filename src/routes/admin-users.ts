import { Router } from 'express'
import { usersController, verifyToken as verify, verifyAdmin as isAdmin } from './container'

const router = Router()

router.get('/', verify, isAdmin, usersController.index)
router.get('/:id', verify, isAdmin, usersController.show)
router.post('/', verify, isAdmin, usersController.save)
router.put('/:id', verify, isAdmin, usersController.update)
router.delete('/delete-all', verify, isAdmin, usersController.deleteAll)
router.delete('/:id', verify, isAdmin, usersController.delete)

export { router as adminUsersRouter }
