import { Types } from 'mongoose'
import {
  ICreateUserParams,
  ITasksRepository,
  IUser,
  IUsersRepository,
  MongooseTasksRepository,
  MongooseUsersRepository,
} from '../repositories'
import { TaskServices, UserServices } from '../services'
import { createUser } from './helpers/user-helpers'

let usersRepository: IUsersRepository
let userServices: UserServices
let tasksRepository: ITasksRepository
let taskServices: TaskServices

const userDataTest: ICreateUserParams = {
  name: 'teste',
  email: 'teste@gmail.com',
  password: '123',
  role: 'CLIENT',
  emailVerified: true,
}

let _user_tester: IUser
let _create_user_message: string

beforeAll(async () => {
  usersRepository = new MongooseUsersRepository()
  tasksRepository = new MongooseTasksRepository()
  taskServices = new TaskServices(tasksRepository, usersRepository)
  userServices = new UserServices(usersRepository, taskServices)
})

beforeEach(async () => {
  const { user, message } = await createUser(userServices, userDataTest)
  _user_tester = user
  _create_user_message = message
})

describe('Create user service', () => {
  it('Should be able to create a new user', async () => {
    expect(_user_tester).toHaveProperty('_id')
    expect(_create_user_message).toBe('User created successfuly!')
  })

  it('Should not be able to create a user with the same email another', async () => {
    await expect(
      userServices.createUser({
        name: 'teste2',
        email: 'teste@gmail.com',
        password: '123',
      }),
    ).rejects.toThrow('User email address already to use!')
  })
})

describe('Update user services', () => {
  it('Should be able to update a user', async () => {
    const { message, user } = await userServices.updateUserById(_user_tester._id, { role: 'ADMIN' })

    expect(message).toBe('User updated successfuly!')
    expect(user).toHaveProperty('_id')
  })

  it('Should not be able to update a user with invalid id', async () => {
    const _id = new Types.ObjectId()
    await expect(userServices.updateUserById(_id.toString(), { role: 'ADMIN' })).rejects.toThrow(
      'User not found!',
    )
  })

  it('Should not be able to update a user with the same email another', async () => {})
})
