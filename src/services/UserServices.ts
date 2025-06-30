import { PassThrough } from 'stream'
import { HttpError } from '../errors/HttpError'
import { ICreateUserParams, IUsersRepository } from '../repositories/UsersRepository'
import bcrypt from 'bcrypt'

export class UserServices {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getAllUsers() {
    return this.usersRepository.find()
  }

  async validateUserById(id: string) {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new HttpError(404, 'User not found!')
    return user
  }

  async getUserById(id: string) {
    return this.validateUserById(id)
  }

  async createUser(params: ICreateUserParams) {
    const { password: rawPassword } = params

    //encrypt password
    const password = await bcrypt.hash(rawPassword as string, 10)
    const newUser = { ...params, password }

    return await this.usersRepository.create(newUser)
  }

  async updateUserById(id: string, params: Partial<ICreateUserParams>) {
    //validate user
    await this.validateUserById(id)

    const { password: rawPassword } = params

    if (rawPassword) {
      //encrypt password
      const password = await bcrypt.hash(rawPassword as string, 10)
      const newUser = { ...params, password }

      Object.assign(params, { password })
    }

    const user = await this.usersRepository.updateById(id, params)
    return { user, message: 'User updated successfuly!' }
  }

  async deleteUserById(id: string) {
    //validate user
    await this.validateUserById(id)

    const user = await this.usersRepository.deleteById(id)
    return { user, message: 'User deleted successfuly!' }
  }
}
