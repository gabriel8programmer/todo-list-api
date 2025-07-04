import { AuthController } from '../controllers/auth-controller'
import { TasksController } from '../controllers/tasks-controller'
import { UsersController } from '../controllers/users-controller'
import { MongooseCodesRepository } from '../repositories/mongoose/mongoose-codes-repository'
import { MongooseRefreshTokensRepository } from '../repositories/mongoose/mongoose-refresh-tokens-repository'
import { MongooseTasksRepository } from '../repositories/mongoose/mongoose-tasks-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { AuthServices } from '../services/auth-services'
import { CodeServices } from '../services/code-services'
import { EmailServices } from '../services/email-services'
import { RefreshTokenServices } from '../services/refresh-token-services'
import { TaskServices } from '../services/task-services'
import { UserServices } from '../services/user-services'

//repositories
export const usersRepository = new MongooseUsersRepository()
export const tasksRepository = new MongooseTasksRepository()
export const refreshTokensRepository = new MongooseRefreshTokensRepository()
export const codesRepository = new MongooseCodesRepository()

//services
export const userServices = new UserServices(usersRepository)
export const taskServices = new TaskServices(tasksRepository)
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
