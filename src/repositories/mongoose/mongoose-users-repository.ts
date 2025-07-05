import { Task, User } from '../../mongoose/schema'
import { ICreateTaskParams, ITask } from '../tasks-repository'
import { ICreateUserParams, IUser, IUsersRepository } from '../users-repository'

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
    const user = await User.findOne({ id }).populate('tasks').lean()
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

  async deleteAll(): Promise<number> {
    return (await User.deleteMany({})).deletedCount
  }

  async findTasksByUserId(id: string): Promise<ITask[]> {
    const tasks = await Task.find({ user: id }).lean()
    return tasks
  }

  async findTaskByIdByUserIdWithTaskId(id: string, taskId: string): Promise<ITask | null> {
    const task = await Task.findOne({ user: id, id: taskId }).lean()
    return task
  }

  /*async addTaskByUserId(id: string, params: Omit<ICreateTaskParams, 'user'>): Promise<ITask> {}

  async updateTaskByIdByUserIdWithTaskId(
    id: string,
    taskId: string,
    params: Partial<Omit<ICreateTaskParams, 'user'>>,
  ): Promise<ITask | null> {}

  async deleteTaskByIdByUserIdWithTaskId(id: string, taskId: string): Promise<ITask | null> {}

  findTasksByUserId: (id: string) => Promise<ITask[]>
  findTaskByIdByUserIdWithTaskId: (id: string, taskId: string) => Promise<ITask | null>
  addTaskByUserId: (id: string, params: Omit<ICreateTaskParams, 'user'>) => Promise<ITask>
  updateTaskByIdByUserIdWithTaskId: (
    id: string,
    taskId: string,
    params: Partial<Omit<ICreateTaskParams, 'user'>>,
  ) => Promise<ITask | null>
  deleteTaskByIdByUserIdWithTaskId: (id: string, taskId: string) => Promise<ITask | null>
  */
}
