import { User } from '../../mongoose/schema'
import { ICreateUserParams, IUser, IUsersRepository } from '../users-repository'

export class MongooseUsersRepository implements IUsersRepository {
  async find(): Promise<IUser[]> {
    return await User.find({}).lean()
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).populate('tasks').lean()
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).populate('tasks').lean()
  }

  async create(params: ICreateUserParams): Promise<IUser> {
    return (await User.create(params)).toObject()
  }

  async updateById(id: string, params: Partial<ICreateUserParams>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, params, { new: true }).lean()
  }

  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).lean()
  }

  async deleteAll(): Promise<number> {
    return (await User.deleteMany({})).deletedCount
  }

  async addTaskById(id: string, taskId: string): Promise<void> {
    await User.findByIdAndUpdate(id, { $push: { tasks: taskId } })
  }

  async removeTaskById(id: string, taskId: string): Promise<void> {
    await User.findByIdAndUpdate(id, { $pull: { tasks: taskId } })
  }

  async clearTaskById(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { tasks: [] })
  }
}
