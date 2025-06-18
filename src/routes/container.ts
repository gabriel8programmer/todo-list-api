import { AuthController } from '../controllers/authController'
import { TasksController } from '../controllers/tasksController'
import { UsersController } from '../controllers/usersController'
import { MongooseTasksRepository } from '../repositories/mongoose/MongooseTasksRepository'
import { MongooseUsersRepository } from '../repositories/mongoose/MongooseUsersRepository'
import { AuthServices } from '../services/AuthServices'
import { TaskServices } from '../services/TaskServices'
import { UserServices } from '../services/UserServices'

//repositories
export const usersRepository = new MongooseUsersRepository()
export const tasksRepository = new MongooseTasksRepository()

//services
export const userServices = new UserServices(usersRepository)
export const taskServices = new TaskServices(tasksRepository)
export const authServices = new AuthServices(usersRepository)

//controllers
export const authController = new AuthController(authServices)
export const usersController = new UsersController(userServices)
export const tasksController = new TasksController(taskServices)
