import { ICreateUserParams, IUsersRepository } from '../repositories/UsersRepository'
import bcrypt from 'bcrypt'

export class UserServices {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async getAllUsers() {}

  async getUserById(id: string) {}

  async createUser(params: ICreateUserParams) {
    const { name, email, password: rawPassword, role } = params

    //encrypt password
    const password = await bcrypt.hash(rawPassword as string, 10)
    const newUser = { ...params, password }

    return await this.usersRepository.create(newUser)
  }

  async updateUserById(id: string, params: Partial<ICreateUserParams>) {}

  async deleteUserById(id: string) {}
}
