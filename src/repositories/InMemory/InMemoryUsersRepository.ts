import { User } from '../../mongoose/schema'
import { ICreateUserParams, IUser, IUsersRepository } from '../UsersRepository'
import { v4 as uuidv4 } from 'uuid'

export class InMemoryUsersRepository implements IUsersRepository {
  private users: IUser[] = []

  async find(): Promise<IUser[]> {
    return this.users
  }

  async findById(id: string): Promise<IUser | null> {
    return this.users.find(user => user.id === id) || null
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find(user => user.email === email) || null
  }

  async create(params: ICreateUserParams): Promise<IUser> {
    const newUser: IUser = {
      id: uuidv4(),
      name: params.name,
      email: params.email,
      password: params.password as string,
      role: params.role || 'CLIENT',
      emailVerified: params.emailVerified,
      isWithGoogle: params.isWithGoogle,
      isWithFacebook: params.isWithFacebook,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(newUser)
    return newUser
  }

  async updateById(id: string, params: Partial<ICreateUserParams>): Promise<IUser | null> {
    this.users = this.users.map(user => {
      if (user.id === id) {
        Object.assign(user, params)
        return user
      }
      return user
    })

    const userUpdated = this.findById(id)
    return userUpdated
  }

  async deleteById(id: string): Promise<IUser | null> {
    const userIndex = this.users.findIndex(user => user.id === id)
    const userDeleted = this.users.splice(userIndex, 1)[0]
    return userDeleted
  }
}
