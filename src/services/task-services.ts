import { ICreateTaskParams, ITasksRepository } from '../repositories/tasks-repository'

export class TaskServices {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async getAllTasks() {}

  async getTaskById(id: string) {}

  async getTaskByUserId(userId: string) {}

  async createTask(params: ICreateTaskParams) {}

  async updateTaskById(id: string, params: Partial<ICreateTaskParams>) {}

  async deleteTaskById(id: string) {}
}
