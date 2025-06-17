import { ICreateTaskParams, ITask, ITasksRepository } from '../TasksRepository'

export class MongooseTasksRepository implements ITasksRepository {
  async find(): Promise<ITask[]> {}
  async findById(id: string): Promise<ITask | null> {}
  async create(params: ICreateTaskParams): Promise<ITask> {}
  async updateById(id: string, params: Partial<ICreateTaskParams>): Promise<ITask | null> {}
  async deleteById(id: string): Promise<ITask | null> {}
}
