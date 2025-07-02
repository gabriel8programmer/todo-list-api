import { Router } from 'express'
import { usersController } from './container'
import { ensureIsAdmin as isAdmin } from '../middlewares/ensure-is-admin-middleware'
import { verifyToken } from '../middlewares/verify-token-middleware'

const adminUsersRouter = Router()

adminUsersRouter.get('/', usersController.index)
adminUsersRouter.get('/:id', verifyToken, isAdmin, usersController.show)
adminUsersRouter.post('/', verifyToken, isAdmin, usersController.save)
adminUsersRouter.put('/:id', verifyToken, isAdmin, usersController.update)
adminUsersRouter.delete('/:id', verifyToken, isAdmin, usersController.delete)
adminUsersRouter.delete('/delete-all', verifyToken, isAdmin, usersController.deleteAll)

export { adminUsersRouter }
