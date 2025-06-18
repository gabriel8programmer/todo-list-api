import { Task } from '../../mongoose/schema'
import { ICreateTaskParams, ITask, ITasksRepository } from '../TasksRepository'

export class MongooseTasksRepository implements ITasksRepository {
  async find(): Promise<ITask[]> {
    return Task.find({}).lean()
  }

  async findById(id: string): Promise<ITask | null> {
    return Task.findOne({ id }).populate('users').lean()
  }

  async create(params: ICreateTaskParams): Promise<ITask> {
    const task = new Task(params)
    await task.save()
    return task
  }

  async updateById(id: string, params: Partial<ICreateTaskParams>): Promise<ITask | null> {
    const updatedTask = await Task.findByIdAndUpdate(id, params, { set: true })
    return updatedTask
  }

  async deleteById(id: string): Promise<ITask | null> {
    const deletedTask = await Task.findByIdAndDelete(id)
    return deletedTask
  }
}
