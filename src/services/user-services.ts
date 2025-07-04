import { HttpError } from '../errors/http-error'
import { ICreateUserParams, IUser, IUsersRepository } from '../repositories/users-repository'
import bcrypt from 'bcrypt'

export class UserServices {
  constructor(private readonly usersRepository: IUsersRepository) {}

  formatUserWithOutPassword(user: IUser) {
    const { password: _, ...rest } = user
    return rest
  }

  async getAllUsers() {
    const users = await this.usersRepository.find()
    return users.map(user => {
      return this.formatUserWithOutPassword(user)
    })
  }

  async validateUserById(id: string) {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new HttpError(404, 'User not found!')
    return this.formatUserWithOutPassword(user)
  }

  async getUserById(id: string) {
    return await this.validateUserById(id)
  }

  async createUser(params: ICreateUserParams) {
    const { password: rawPassword } = params

    //encrypt password
    const password = await bcrypt.hash(rawPassword as string, 10)
    const userData = { ...params, password }

    const newUser = await this.usersRepository.create(userData)
    const user = this.formatUserWithOutPassword(newUser)
    return { message: 'User created successfuly!', user }
  }

  async updateUserById(id: string, params: Partial<ICreateUserParams>) {
    const { password: rawPassword } = params

    if (rawPassword) {
      //encrypt password
      const password = await bcrypt.hash(rawPassword as string, 10)
      Object.assign(params, { password })
    }

    const updatedUser = await this.usersRepository.updateById(id, params)
    if (!updatedUser) throw new HttpError(404, 'User not found!')

    return {
      user: this.formatUserWithOutPassword(updatedUser),
      message: 'User updated successfuly!',
    }
  }

  async deleteUserById(id: string) {
    const deletedUser = await this.usersRepository.deleteById(id)
    if (!deletedUser) throw new HttpError(404, 'User not found!')
    return {
      user: this.formatUserWithOutPassword(deletedUser),
      message: 'User deleted successfuly!',
    }
  }

  async deleteAllUsers() {
    const result = await this.usersRepository.deleteAll()
    return { message: 'All users are deleted successfuly!', count: result }
  }
}
