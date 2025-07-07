import { HttpError } from '../errors/http-error'
import { IUsersRepository } from '../repositories'
import {
  ICreateTaskParams,
  ITasksRepository,
  IUpdateTaskParams,
} from '../repositories/tasks-repository'

export class TaskServices {
  constructor(
    private readonly tasksRepository: ITasksRepository,
    private readonly usersRepository: IUsersRepository,
  ) {}

  async getAllTasks() {
    return this.tasksRepository.find({})
  }

  async getTaskById(id: string) {
    const task = await this.tasksRepository.findById(id)
    if (!task) throw new HttpError(404, 'Task not found!')
    return task
  }

  async getTasksByUserId(userId: string) {
    const tasks = await this.tasksRepository.find({ user: userId })
    return tasks
  }

  async createTask(params: ICreateTaskParams) {
    //valid if params user is valid
    const userExists = await this.usersRepository.findById(params.user)
    if (!userExists) throw new HttpError(404, 'User id invalid!')

    const newTask = await this.tasksRepository.create(params)

    //update user
    const { user: id, _id: taskId } = newTask
    await this.usersRepository.addTaskById(id.toString(), taskId)

    return { task: newTask, message: 'Task created successfuly!' }
  }

  async updateTaskById(id: string, params: IUpdateTaskParams) {
    const updatedTask = await this.tasksRepository.updateById(id, params)
    if (!updatedTask) throw new HttpError(404, 'Task not found!')
    return { task: updatedTask, message: 'Task Updated successfuly!' }
  }

  async deleteTaskById(id: string) {
    const deletedTask = await this.tasksRepository.deleteById(id)
    if (!deletedTask) throw new HttpError(404, 'Task not found!')
    //update user
    const { user: userId, _id: taskId } = deletedTask
    await this.usersRepository.removeTaskById(userId.toString(), taskId)
    return { task: deletedTask, message: 'Task deleted successfuly!' }
  }

  async deleteAllTasks() {
    const tasks = await this.getAllTasks()
    const count = await this.tasksRepository.deleteAll()

    await Promise.all(
      tasks.map(task => {
        this.usersRepository.removeTaskById(task.user.toString(), task._id)
      }),
    )

    return { message: 'All Task deleted successsfuly!', count }
  }

  async deleteAllTasksByUserId(userId: string) {
    const count = await this.tasksRepository.deleteAllByUserId(userId)
    await this.usersRepository.clearTaskById(userId)
    return { message: 'All Task deleted successsfuly!', count }
  }
}
