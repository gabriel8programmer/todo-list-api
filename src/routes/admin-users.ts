import { Router } from 'express'
import { isAdmin, verifyToken as verify } from '../middlewares/auth-middleware'
import { usersController } from './container'

const adminUsersRouter = Router()

adminUsersRouter.get('/', verify, isAdmin, usersController.index)
adminUsersRouter.get('/:id', verify, isAdmin, usersController.show)
adminUsersRouter.post('/', verify, isAdmin, usersController.save)
adminUsersRouter.put('/:id', verify, isAdmin, usersController.update)
adminUsersRouter.delete('/:id', verify, isAdmin, usersController.delete)
adminUsersRouter.delete('/delete-all', verify, isAdmin, usersController.deleteAll)

export { adminUsersRouter }
