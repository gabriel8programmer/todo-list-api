import { User } from '../../mongoose/schema'
import { ICreateUserParams, IUser, IUsersRepository } from '../UsersRepository'

export class MongooseUsersRepository implements IUsersRepository {
  private formatUserForResponse(user: any): IUser {
    const { _id: _, ...rest } = user
    return rest
  }

  async find(): Promise<IUser[]> {
    const users = await User.find({}).lean()
    return users.map(user => this.formatUserForResponse(user))
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).populate('tasks').lean()
    return user ? this.formatUserForResponse(user) : null
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email }).populate('tasks').lean()
    return user ? this.formatUserForResponse(user) : null
  }

  async create(params: ICreateUserParams): Promise<IUser> {
    const user = await User.create(params)
    return this.formatUserForResponse(user.toObject())
  }

  async updateById(id: string, params: Partial<ICreateUserParams>): Promise<IUser | null> {
    const user = await User.findOneAndUpdate({ id }, params, { new: true }).lean()
    return user ? this.formatUserForResponse(user) : null
  }

  async deleteById(id: string): Promise<IUser | null> {
    const user = await User.findOneAndDelete({ id }).lean()
    return user ? this.formatUserForResponse(user) : null
  }
}
