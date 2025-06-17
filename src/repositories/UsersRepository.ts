import { Types } from 'mongoose'
import { ITask } from './TasksRepository'

export type IUserRole = 'ADMIN' | 'CLIENT'

export interface IUser {
  id: string
  name: string
  email: string
  password: string
  role: IUserRole
  isWithGoogle: boolean
  isWithFacebook: boolean
  tasks: ITask[]
}

export interface ICreateUserParams {
  name: string
  email: string
  password?: string
  role?: 'ADMIN' | 'CLIENT'
}

export interface IUsersRepository {
  find: () => Promise<IUser[]>
  findById: (id: string) => Promise<IUser | null>
  create: (params: ICreateUserParams) => Promise<IUser>
  updateById: (id: string, params: Partial<ICreateUserParams>) => Promise<IUser | null>
  deleteById: (id: string) => Promise<IUser | null>
}
