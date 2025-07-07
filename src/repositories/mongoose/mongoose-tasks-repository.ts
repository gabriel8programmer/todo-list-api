import { Task } from '../../mongoose/schema'
import {
  ICreateTaskParams,
  IFindTasksWhereParams,
  ITask,
  ITasksRepository,
  IUpdateTaskParams,
} from '../tasks-repository'

export class MongooseTasksRepository implements ITasksRepository {
  async find(where: IFindTasksWhereParams): Promise<ITask[]> {
    return await Task.find(where).lean()
  }

  async findById(id: string): Promise<ITask | null> {
    return await Task.findById(id).populate('users').lean()
  }

  async create(params: ICreateTaskParams): Promise<ITask> {
    return (await Task.create(params)).toObject()
  }

  async updateById(id: string, params: IUpdateTaskParams): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, params, { set: true }).lean()
  }

  async deleteById(id: string): Promise<ITask | null> {
    return await Task.findByIdAndDelete(id).lean()
  }

  async deleteAll(): Promise<number> {
    return (await Task.deleteMany({})).deletedCount
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    return (await Task.deleteMany({ user: userId })).deletedCount
  }
}
