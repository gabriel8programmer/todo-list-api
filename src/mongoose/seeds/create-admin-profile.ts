import { EnvSchema } from '../../schemas/env'
import { MongooseUsersRepository } from '../../repositories/mongoose/MongooseUsersRepository'
import { encryptPassword } from '../../utils/passwords/encryptPassword'

const _admin_experimental_pass = EnvSchema.parse(process.env).EXPERIMENTAL_ADMIN_PASS || '123'

export const createAdminProfile = async () => {
  const usersRepository = new MongooseUsersRepository()
  usersRepository.create({
    name: 'admin',
    email: 'admin@gmail.com',
    password: await encryptPassword(_admin_experimental_pass),
    emailVerified: true,
  })
}
