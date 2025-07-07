import {
  ITasksRepository,
  IUsersRepository,
  MongooseTasksRepository,
  MongooseUsersRepository,
} from '../repositories'
import { TaskServices, UserServices } from '../services'

let usersRepository: IUsersRepository
let userServices: UserServices
let tasksRepository: ITasksRepository
let taskServices: TaskServices

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
  tasksRepository = new MongooseTasksRepository()
  taskServices = new TaskServices(tasksRepository, usersRepository)
  userServices = new UserServices(usersRepository, taskServices)
})

describe('user services', () => {
  it('Should be able to create a new user', async () => {
    const { user, message } = await userServices.createUser({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123',
      role: 'CLIENT',
      emailVerified: true, // yes, here the user can to create user already with verified email
    })

    expect(user).toHaveProperty('_id')
    expect(message).toBe('User created successfuly!')
  })

  it('Should not be able to create a user with the same email another', async () => {
    await userServices.createUser({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    await expect(
      userServices.createUser({
        name: 'teste2',
        email: 'teste@gmail.com', //invalid email
        password: '123',
      }),
    ).rejects.toThrow('User email address already to use!')
  })
})
