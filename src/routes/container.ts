import { AuthController } from '../controllers/authController'
import { TasksController } from '../controllers/tasksController'
import { UsersController } from '../controllers/usersController'
import { MongooseCodesRepository } from '../repositories/mongoose/MongooseCodesRepository'
import { MongooseTasksRepository } from '../repositories/mongoose/MongooseTasksRepository'
import { MongooseUsersRepository } from '../repositories/mongoose/MongooseUsersRepository'
import { AuthServices } from '../services/AuthServices'
import { CodeServices } from '../services/CodeServices'
import { EmailServices } from '../services/EmailServices'
import { TaskServices } from '../services/TaskServices'
import { UserServices } from '../services/UserServices'

//codes
export const codesRepository = new MongooseCodesRepository()
export const codeServices = new CodeServices(codesRepository)

//email services
export const emailServices = new EmailServices(codeServices)

//repositories
export const usersRepository = new MongooseUsersRepository()
export const tasksRepository = new MongooseTasksRepository()

//services
export const userServices = new UserServices(usersRepository)
export const taskServices = new TaskServices(tasksRepository)
export const authServices = new AuthServices(usersRepository, codeServices, emailServices)

//controllers
export const authController = new AuthController(authServices)
export const usersController = new UsersController(userServices)
export const tasksController = new TasksController(taskServices)
