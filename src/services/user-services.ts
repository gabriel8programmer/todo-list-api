import { HttpError } from '../errors/http-error'
import { ICreateTaskParams, ITaskRaw } from '../repositories/tasks-repository'
import { ICreateUserParams, IUser, IUsersRepository } from '../repositories/users-repository'
import bcrypt from 'bcrypt'
import { TaskServices } from './task-services'

export class UserServices {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly taskServices: TaskServices,
  ) {}

  formatUserWithOutPassword(user: IUser) {
    const { password: _, ...rest } = user
    return rest
  }

  async getAllUsers() {
    const users = await this.usersRepository.find()
    return users.map(user => {
      return this.formatUserWithOutPassword(user)
    })
  }

  async getUserById(_id: string) {
    const user = await this.usersRepository.findById(_id)
    if (!user) throw new HttpError(404, 'User not found!')
    return this.formatUserWithOutPassword(user)
  }

  async createUser(params: Omit<ICreateUserParams, 'isWithGoogle' | 'isWithFacebook'>) {
    const userExists = await this.usersRepository.findByEmail(params.email)
    if (userExists) throw new HttpError(403, 'User email address already to use!')

    const { password: rawPassword } = params

    //encrypt password
    const password = await bcrypt.hash(rawPassword as string, 10)
    const userData = { ...params, password }

    const newUser = await this.usersRepository.create(userData)
    const user = this.formatUserWithOutPassword(newUser)
    return { message: 'User created successfuly!', user }
  }

  async updateUserById(
    _id: string,
    params: Partial<Omit<ICreateUserParams, 'isWithGoogle' | 'isWithFacebook'>>,
  ) {
    const { password: rawPassword } = params

    if (rawPassword) {
      //encrypt password
      const password = await bcrypt.hash(rawPassword as string, 10)
      Object.assign(params, { password })
    }

    const updatedUser = await this.usersRepository.updateById(_id, params)
    if (!updatedUser) throw new HttpError(404, 'User not found!')

    return {
      user: this.formatUserWithOutPassword(updatedUser),
      message: 'User updated successfuly!',
    }
  }

  async deleteUserById(_id: string) {
    const deletedUser = await this.usersRepository.deleteById(_id)
    if (!deletedUser) throw new HttpError(404, 'User not found!')

    //delete all tasks from this user
    this.taskServices.deleteAllTasksByUserId(_id)

    return {
      user: this.formatUserWithOutPassword(deletedUser),
      message: 'User deleted successfuly!',
    }
  }

  async deleteAllUsers() {
    const result = await this.usersRepository.deleteAll()
    //delete all tasks
    await this.taskServices.deleteAllTasks()
    return { message: 'All users are deleted successfuly!', count: result }
  }

  async getTasksFromUserById(_id: string) {
    const tasks = await this.taskServices.getTasksByUserId(_id)
    return tasks
  }

  async getTaskFromUserByIdWithTaskId(_id: string, taskId: string) {
    //validate user by _id and get tasks
    const user = await this.getUserById(_id)

    const tasks = user.tasks as ITaskRaw[]

    //validate task by _id
    const task = tasks.find(task => task._id === taskId)
    if (!task) throw new HttpError(404, 'Task is not exists in this user!')

    return task
  }

  async createTaskFromUserById(_id: string, params: Omit<ICreateTaskParams, 'user'>) {
    //validate user by _id
    const user = await this.getUserById(_id)

    //create new task
    const newTask = await this.taskServices.createTask({ ...params, user: user._id })

    //update user
    await this.usersRepository.addTaskById(_id, newTask.task._id)

    return newTask
  }

  async updateTaskFromUserByIdWithTaskId(
    _id: string,
    taskId: string,
    params: Partial<Omit<ICreateTaskParams, 'user'>>,
  ) {
    //validate user by _id and get tasks
    const user = await this.getUserById(_id)

    const tasks = user.tasks as ITaskRaw[]

    //validate task by _id
    const task = tasks.find(task => task._id === taskId)
    if (!task) throw new HttpError(404, 'Task is not exists in this user!')

    const updatedTask = await this.taskServices.updateTaskById(taskId, params)

    return updatedTask
  }
  async removeTaskFromUserByIdWithTaskId(_id: string, taskId: string) {
    //validate user by _id and get tasks
    const user = await this.getUserById(_id)

    const tasks = user.tasks as ITaskRaw[]

    //validate task by _id
    const task = tasks.find(task => task._id === taskId)
    if (!task) throw new HttpError(404, 'Task is not exists in this user!')

    const updatedTask = await this.taskServices.deleteTaskById(taskId)

    //udpate user
    await this.usersRepository.removeTaskById(_id, task._id)

    return updatedTask
  }

  async removeAllTasksFromUserById(_id: string) {
    //validate user by _id
    await this.getUserById(_id)

    const data = await this.taskServices.deleteAllTasksByUserId(_id)

    //udpate user
    await this.usersRepository.clearTaskById(_id)

    return data
  }
}
