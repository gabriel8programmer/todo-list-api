import { IUserRaw } from './users-repository'

export interface ITaskBase {
  id: string
  title: string
  description?: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}

export interface ITaskPopulated extends ITaskBase {
  user: IUserRaw
}

export interface ITaskRaw extends ITaskBase {
  user: string
}

export type ITask = ITaskRaw | ITaskPopulated

export interface ICreateTaskParams {
  title: string
  description?: string
  status?: 'todo' | 'doing' | 'done'
  priority?: 'low' | 'medium' | 'high'
  user: string
}

export interface ITasksRepository {
  find: () => Promise<ITask[]>
  findById: (id: string) => Promise<ITask | null>
  create: (params: ICreateTaskParams) => Promise<ITask>
  updateById: (id: string, params: Partial<ICreateTaskParams>) => Promise<ITask | null>
  deleteById: (id: string) => Promise<ITask | null>
}
