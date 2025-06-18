import { IUsersRepository } from '../repositories/UsersRepository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { HttpError } from '../errors/HttpError'
import { EnvSchema } from '../schemas/env'
import { v4 as uuidv4 } from 'uuid'

export class AuthServices {
  constructor(private readonly usersRepository: IUsersRepository) {}

  private async validateEmailUser(email: string) {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) throw new HttpError(404, 'User not found!')
    return user
  }

  async register(params: { name: string; email: string; password: string }) {
    const { name, email, password: rawPassword } = params
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) throw new HttpError(403, 'User with this email address already exists!')

    //encrypt password
    const password = await bcrypt.hash(rawPassword, 10)

    const data = { name, email, password }
    const newUser = await this.usersRepository.create(data)
    return { ...newUser, password: undefined }
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params
    const user = await this.validateEmailUser(email)

    const matchedPassword = await bcrypt.compare(password, user.password as string)

    if (!matchedPassword) throw new HttpError(401, 'Invalid email or password!')

    if (!user.emailVerified) {
      console.log('Verify your email')
      return
    }

    //create access token
    const jwtToken = EnvSchema.parse(process.env).JWT_SECRET_KEY || 'jwt_secret_key'
    const payload = { id: user.id }
    const accessToken = jwt.sign(payload, jwtToken, { expiresIn: '1d' })
    const refreshToken = uuidv4()

    return { accessToken, refreshToken, user: { ...user, password: undefined } }
  }

  async verifyLogin(params: { email: string; verificationCode: string }) {}

  async logout(params: { email: string }) {}

  async refresh(params: { email: string }) {}

  async LoginWithGoogle(params: { name: string; email: string; emailVerified: boolean }) {}

  async LoginWithFacebook(params: { name: string; email: string; emailVerified: boolean }) {}

  async forgotPassword(params: { email: string }) {}

  async resetPassword(params: { email: string; verificationCode: string }) {}
}
