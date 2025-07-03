import { Router } from 'express'
import { usersController } from './container'
import { ensureIsAdmin as isAdmin } from '../middlewares/ensure-is-admin-middleware'
import { verifyToken } from '../middlewares/verify-token-middleware'

const adminUsersRouter = Router()

adminUsersRouter.get('/', usersController.index)
adminUsersRouter.get('/:id', usersController.show)
adminUsersRouter.post('/', usersController.save)
adminUsersRouter.put('/:id', usersController.update)
adminUsersRouter.delete('/:id', usersController.delete)
adminUsersRouter.delete('/delete-all', usersController.deleteAll)

export { adminUsersRouter }
