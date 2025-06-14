import { UsersModel } from '../../../models/users'
import bcrypt from 'bcrypt'

const adminPass = process.env.EXPERIMENTAL_ADMIN_PASS || '123'

export const createAdminProfile = async () => {
  await UsersModel.create({
    name: 'Admin',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync(adminPass, 10),
    role: 'ADMIN',
  })
}
