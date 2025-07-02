import { IUsersRepository } from '../repositories/users-repository'
import bcrypt from 'bcrypt'
import { HttpError } from '../errors/http-error'
import { v4 as uuidv4 } from 'uuid'
import { genDefaultJwt } from '../utils/jwt/genDefaultJwt'
import { EmailServices } from './email-services'
import { CodeServices } from './code-services'
import { RefreshTokenServices } from './refresh-token-services'

export class AuthServices {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private refreshTokenServices: RefreshTokenServices,
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
    return { user: userWithOutPassword, message: 'User Registered successfuly. Log in now!' }
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params
    const user = await this.usersRepository.findByEmail(email)
    if (!user) throw new HttpError(400, 'Invalid email or password!')

    if (user.isWithFacebook || user.isWithGoogle)
      throw new HttpError(401, 'User already authenticated with social method!')

    const matchedPassword = user ? await bcrypt.compare(password, user.password as string) : null
    if (!matchedPassword) throw new HttpError(400, 'Invalid email or password!')

    if (!user.emailVerified) {
      await this.emailServices?.sendEmailWithVerificationCode(email, user.id)
      return {
        requiresEmailVerification: true,
        message:
          'Verification email required. Please, check your inbox to receive the verification code.',
      }
    }

    //create access token
    const accessToken = genDefaultJwt({ id: user.id })

    //create refresh token
    const { token: refreshToken } = await this.refreshTokenServices.createToken({
      token: uuidv4(),
      userId: user.id,
    })

    const { password: _, ...userWithOutPassword } = user
    return { accessToken, refreshToken, user: userWithOutPassword, message: 'Log in successfuly!' }
  }

  async verifyEmail(params: { email: string; verificationCode: string }) {
    const { email, verificationCode } = params

    //validate user and destructuring
    const { id } = await this.validateEmailUser(email)

    //validate code
    const codes = await this.codeServices.findCodeByUserId(id)

    if (!codes || codes?.length <= 0)
      throw new HttpError(400, 'There is no code available for this user!')

    const codeContainInCodes = codes.find(code => code.code === verificationCode)
    if (!codeContainInCodes) throw new HttpError(400, 'Invalid verification code!')

    //delete codes from user
    await this.codeServices.deleteAllCodesByUserId(id)

    //update email verified in user
    await this.usersRepository.updateById(id, { emailVerified: true })

    return { message: 'Email verified successfuly!' }
  }

  async logout(params: { email: string }) {
    const { email } = params

    //validate user
    const user = await this.validateEmailUser(email)

    //remove refresh tokens this user
    await this.refreshTokenServices.deleteTokensByUserId(user.id)

    return { message: 'Logout done successfuly!' }
  }

  async refresh(params: { email: string }) {
    const { email } = params

    //validate user
    const { id } = await this.validateEmailUser(email)

    const tokens = await this.refreshTokenServices.getTokensByUserId(id)
    if (tokens.length === 0) throw new HttpError(401, 'Session expired or user is logged out!')

    //generate new accesstoken and refresh token
    const accessToken = await genDefaultJwt({ id })

    const { token: refreshToken } = await this.refreshTokenServices.createToken({
      token: uuidv4(),
      userId: id,
    })

    return { accessToken, refreshToken, message: 'Access tokens refreshed successfuly!' }
  }

  async socialLogin(params: {
    name: string
    email: string
    emailVerified: boolean
    isWithGoogle?: boolean
    isWithFacebook?: boolean
  }) {
    const { email } = params

    //validate user
    this.validateEmailUser(email)

    const user = await this.usersRepository.create(params)

    //create access token and refresh token
    const accessToken = genDefaultJwt({ id: user.id })
    const refreshToken = uuidv4()

    const { password: _, ...restUser } = user
    return { user: restUser, accessToken, refreshToken, message: 'Social Log in successfuly!' }
  }

  async forgotPassword(params: { email: string }) {
    const { email } = params
    //validate user and destructuring
    const { id: userId } = await this.validateEmailUser(email)

    //send verification email
    await this.emailServices?.sendEmailWithVerificationCode(email, userId)

    return { message: 'Verification code sent.' }
  }

  async resetPassword(params: { email: string; newPassword: string; verificationCode: string }) {
    const { email, newPassword, verificationCode } = params

    //validate user and destructuring
    const { id } = await this.validateEmailUser(email)

    //validate code
    const codes = await this.codeServices.findCodeByUserId(id)

    if (!codes || codes?.length <= 0)
      throw new HttpError(400, 'There is no code available for this user!')

    const codeContainInCodes = codes.find(code => code.code === verificationCode)
    if (!codeContainInCodes) throw new HttpError(400, 'Invalid verification code!')

    //delete codes from user
    await this.codeServices.deleteAllCodesByUserId(id)

    //encrypt password
    const password = await bcrypt.hash(newPassword, 10)

    //update password
    await this.usersRepository.updateById(id, { password })

    return { message: 'Password successfuly reset.' }
  }
}
