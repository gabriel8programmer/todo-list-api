import { makeVerifyAdminMiddleware } from '../middlewares/verify-admin-middleware'
import { makeVerifyTokenMiddleware } from '../middlewares/verify-token-middleware'
import { makeVerifyUserAccessMiddleware } from '../middlewares/verify-user-access-middleware'

import {
  MongooseUsersRepository,
  MongooseCodesRepository,
  MongooseTasksRepository,
  MongooseRefreshTokensRepository,
} from '../repositories'

import {
  UserServices,
  AuthServices,
  CodeServices,
  EmailServices,
  RefreshTokenServices,
  TaskServices,
} from '../services'

import { AuthController, UsersController, TasksController } from '../controllers'

//repositories
export const usersRepository = new MongooseUsersRepository()
export const tasksRepository = new MongooseTasksRepository()
export const refreshTokensRepository = new MongooseRefreshTokensRepository()
export const codesRepository = new MongooseCodesRepository()

//services
export const taskServices = new TaskServices(tasksRepository)
export const userServices = new UserServices(usersRepository, taskServices)
export const refreshTokenServices = new RefreshTokenServices(refreshTokensRepository)
export const codeServices = new CodeServices(codesRepository)
export const emailServices = new EmailServices(codeServices)
export const authServices = new AuthServices(
  usersRepository,
  refreshTokenServices,
  codeServices,
  emailServices,
)

//controllers
export const authController = new AuthController(authServices)
export const usersController = new UsersController(userServices)
export const tasksController = new TasksController(taskServices)

//middlewares
export const verifyToken = makeVerifyTokenMiddleware(userServices, refreshTokensRepository)
export const verifyAdmin = makeVerifyAdminMiddleware()
export const verifyUserAccess = makeVerifyUserAccessMiddleware()
