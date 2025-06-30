import { Router } from 'express'
import { isAdmin, verifyToken as verify } from '../../middlewares/auth'
import { tasksController, usersController } from '../container'

const adminRouter = Router()

// USER ROUTES ONLY ADMINS
adminRouter.get('/users', verify, isAdmin, usersController.index)
adminRouter.post('/users', verify, isAdmin, usersController.save)
adminRouter.put('/users/:id', verify, isAdmin, usersController.update)
adminRouter.delete('/users/:id', verify, isAdmin, usersController.delete)
// TASK ROUTES ONLY ADMINS
adminRouter.get('/tasks', verify, isAdmin, tasksController.all)
adminRouter.delete('/tasks/:taskId', verify, isAdmin, tasksController.delete)

export { adminRouter }
