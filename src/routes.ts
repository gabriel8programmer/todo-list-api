import { Router } from 'express'
import { AuthController as Auth } from './controllers/auth'
import { UsersController as Users } from './controllers/users'
import { TasksController as Task } from './controllers/tasks'
import * as oAuth from './middlewares/oAuth'
import * as v from './middlewares/validations'
import { isAdmin, verifyToken as verify } from './middlewares/auth'

const router = Router()

// AUTH ROUTES
router.post('/auth/register', Auth.register)
router.post('/auth/login', Auth.login)
router.post('/auth/social/google', oAuth.google, Auth.social)
// router.post("/auth/social/facebook", Auth.social);
router.post('/auth/recover-password', Auth.recoverPassword)

// USER TASKS PUBLIC ROUTES
router.get('/users/:id/tasks', verify, v.validateUserByTask, Task.index)
router.get('/users/:id/tasks/:taskId', verify, v.validateUserByTask, Task.show)
router.post('/users/:id/tasks', verify, v.validateUserByTask, Task.save)
router.put('/users/:id/tasks/:taskId', verify, v.validateUserByTask, Task.update)
router.delete('/users/:id/tasks/:taskId', verify, v.validateUserByTask, Task.delete)
router.delete('/users/:id/tasks/delete-all', verify, v.validateUserByTask, Task.deleteAll)

// USER ROUTES ONLY ADMINS
router.get('/admin/users', verify, isAdmin, Users.index)
router.get('/admin/users/:id', verify, isAdmin, Users.show)
router.post('/admin/users', verify, isAdmin, Users.save)
router.put('/admin/users/:id', verify, isAdmin, Users.update)
router.delete('/admin/users/:id', verify, isAdmin, Users.delete)
// TASK ROUTES ONLY ADMINS
router.get('/admin/tasks', verify, isAdmin, Task.all)
router.delete('/admin/tasks/:taskId', verify, isAdmin, Task.all)

export default router
