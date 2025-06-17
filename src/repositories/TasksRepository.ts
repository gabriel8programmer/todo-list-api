export interface ITask {
  id: string
  title: string
  description: string
  status: 'todo' | 'doing' | 'done'
  priority: 'low' | 'medium' | 'high'
  user: string
}

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
