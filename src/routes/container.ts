import { AuthController } from '../controllers/auth-controller'
import { TasksController } from '../controllers/tasks-controller'
import { UsersController } from '../controllers/users-controller'
import { MongooseCodesRepository } from '../repositories/mongoose/mongoose-codes-repository'
import { MongooseTasksRepository } from '../repositories/mongoose/mongoose-tasks-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { AuthServices } from '../services/auth-services'
import { CodeServices } from '../services/code-services'
import { EmailServices } from '../services/email-services'
import { TaskServices } from '../services/task-services'
import { UserServices } from '../services/user-services'

//test instances
import { FakeEmailServices } from '../tests/mocks/fake-email-services'

//codes
export const codesRepository = new MongooseCodesRepository()
export const codeServices = new CodeServices(codesRepository)

//email services
export let emailServices: EmailServices

if (process.env.NODE_ENV === 'test') {
  emailServices = new FakeEmailServices(codeServices)
} else {
  emailServices = new EmailServices(codeServices)
}

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
