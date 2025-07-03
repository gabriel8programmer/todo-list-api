import { Task, User } from '../../mongoose/schema'
import { ICreateTaskParams, ITask, ITasksRepository } from '../tasks-repository'

export class MongooseTasksRepository implements ITasksRepository {
  private formatTaskForResponse(task: any): ITask {
    const { _id: _, ...rest } = task
    return rest
  }

  async find(): Promise<ITask[]> {
    const tasks = await Task.find({}).lean()
    return tasks.map(task => this.formatTaskForResponse(task))
  }

  async findById(id: string): Promise<ITask | null> {
    const task = await Task.findOne({ id }).populate('users').lean()
    return this.formatTaskForResponse(task)
  }

  async create(params: ICreateTaskParams): Promise<ITask> {
    const task = (await Task.create(params)).toObject()
    return this.formatTaskForResponse(task)
  }

  async updateById(id: string, params: Partial<ICreateTaskParams>): Promise<ITask | null> {
    const updatedTask = await Task.findByIdAndUpdate(id, params, { set: true }).lean()
    return this.formatTaskForResponse(updatedTask)
  }

  async deleteById(id: string): Promise<ITask | null> {
    const deletedTask = await Task.findByIdAndDelete(id).lean()
    return this.formatTaskForResponse(deletedTask)
  }

  async deleteAll(): Promise<number> {
    return (await Task.deleteMany({})).deletedCount
  }
}
