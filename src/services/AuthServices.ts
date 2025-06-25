import { IUser, IUsersRepository } from '../repositories/UsersRepository'
import bcrypt from 'bcrypt'
import { HttpError } from '../errors/HttpError'
import { v4 as uuidv4 } from 'uuid'
import { genDefaultJwt } from '../utils/jwt/genDefaultJwt'
import { EmailServices } from './EmailServices'
import { CodeServices } from './CodeServices'

export class AuthServices {
  constructor(
    private readonly usersRepository: IUsersRepository,
    //services
    private codeServices: CodeServices,
    private emailServices?: EmailServices,
  ) {}

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

    const { password: _, ...userWithOutPassword } = newUser
    return userWithOutPassword
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params
    const user = await this.usersRepository.findByEmail(email)
    const matchedPassword = user ? await bcrypt.compare(password, user.password as string) : null

    if (!user || !matchedPassword) throw new HttpError(400, 'Invalid email or password!')

    if (!user.emailVerified) {
      await this.emailServices?.sendEmailWithVerificationCode(email, user.id)
      return { requiresEmailVerification: true }
    }

    //create access token
    const accessToken = genDefaultJwt({ id: user.id })
    const refreshToken = uuidv4()

    const { password: _, ...userWithOutPassword } = user
    return { accessToken, refreshToken, user: userWithOutPassword }
  }

  async verifyLogin(params: { email: string; verificationCode: string }) {
    const { email, verificationCode } = params
    const { id } = await this.validateEmailUser(email)

    const codes = await this.codeServices.findCodeByUserId(id)

    if (!codes || codes?.length <= 0)
      throw new HttpError(400, 'There is no code available for this user!')

    const codeContainInCodes = codes.find(code => code.code === verificationCode)
    if (!codeContainInCodes) throw new HttpError(400, 'Invalid verification code!')

    //delete codes from user
    await this.codeServices.deleteAllCodesByUserId(id)

    //update email verified in user
    const userUpdated = await this.usersRepository.updateById(id, { emailVerified: true })

    //create accesstoken and refreshToken
    const accessToken = genDefaultJwt({ id })
    const refreshToken = uuidv4()

    const { password: _, ...userWithOutPassword } = userUpdated as IUser
    return { accessToken, refreshToken, user: userWithOutPassword }
  }

  async logout(params: { email: string }) {}

  async refresh(params: { email: string }) {}

  async LoginWithGoogle(params: { name: string; email: string; emailVerified: boolean }) {}

  async LoginWithFacebook(params: { name: string; email: string; emailVerified: boolean }) {}

  async forgotPassword(params: { email: string }) {}

  async resetPassword(params: { email: string; verificationCode: string }) {}
}
