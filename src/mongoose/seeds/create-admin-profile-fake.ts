import { MongooseUsersRepository } from '../../repositories/mongoose/mongoose-users-repository'
import { UserServices } from '../../services/user-services'

const usersRepository = new MongooseUsersRepository()
const userServices = new UserServices(usersRepository)

export const createAdminProfileFake = async () => {
  const adminProfileExists = await usersRepository.findByEmail('admin@gmail.com')

  if (!adminProfileExists) {
    await userServices.createUser({
      name: 'admin',
      email: 'admin@gmail.com',
      password: '123',
      role: 'ADMIN',
      emailVerified: true,
    })
  }
}
