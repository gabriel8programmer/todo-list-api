import { HttpError } from '../errors/http-error'
import { ICreateTaskParams, ITasksRepository } from '../repositories/tasks-repository'

export class TaskServices {
  constructor(private readonly tasksRepository: ITasksRepository) {}

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
    const newTask = await this.tasksRepository.create(params)
    return { task: newTask, message: 'Task created successfuly!' }
  }

  async updateTaskById(id: string, params: Partial<ICreateTaskParams>) {
    const updatedTask = await this.tasksRepository.updateById(id, params)
    if (!updatedTask) throw new HttpError(404, 'Task not found!')
    return { task: updatedTask, message: 'Task Updated successfuly!' }
  }

  async deleteTaskById(id: string) {
    const deletedTask = await this.tasksRepository.deleteById(id)
    if (!deletedTask) throw new HttpError(404, 'Task not found!')
    return { task: deletedTask, message: 'Task deleted successfuly!' }
  }

  async deleteAllTasks() {
    const count = await this.tasksRepository.deleteAll()
    return { message: 'All Task deleted successsfuly!', count }
  }

  async deleteAllTasksByUserId(userId: string) {
    const count = await this.tasksRepository.deleteAllByUserId(userId)
    return { message: 'All Task deleted successsfuly!', count }
  }
}
