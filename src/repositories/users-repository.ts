import { ITaskRaw } from './tasks-repository'

export type IUserRole = 'ADMIN' | 'CLIENT'

export interface IUserBase {
  _id: string
  name: string
  email: string
  password?: string
  role?: IUserRole
  emailVerified?: boolean
  isWithGoogle?: boolean
  isWithFacebook?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface IUserPopulated extends IUserBase {
  tasks: ITaskRaw[]
}

export interface IUserRaw extends IUserBase {
  tasks: string[]
}

export type IUser = IUserPopulated | IUserRaw

export interface ICreateUserParams {
  name: string
  email: string
  password?: string
  role?: 'ADMIN' | 'CLIENT'
  emailVerified?: boolean
  isWithGoogle?: boolean
  isWithFacebook?: boolean
}

export interface IUsersRepository {
  find: () => Promise<IUser[]>
  findById: (id: string) => Promise<IUser | null>
  findByEmail: (email: string) => Promise<IUser | null>
  create: (params: Omit<ICreateUserParams, 'updatedAt'>) => Promise<IUser>
  updateById: (id: string, params: Partial<ICreateUserParams>) => Promise<IUser | null>
  deleteById: (id: string) => Promise<IUser | null>
  deleteAll: () => Promise<number>
  addTaskById: (id: string, taskId: string) => Promise<void>
  removeTaskById: (id: string, taskId: string) => Promise<void>
  clearTaskById: (id: string) => Promise<void>
}
