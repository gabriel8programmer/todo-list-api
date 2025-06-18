import { User } from '../../mongoose/schema'
import { ICreateUserParams, IUser, IUsersRepository } from '../UsersRepository'

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
    const user = new User(params)
    await user.save()
    return user
  }

  async updateById(id: string, params: Partial<ICreateUserParams>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, params, { set: true }).lean()
  }

  async deleteById(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id).lean()
  }
}
