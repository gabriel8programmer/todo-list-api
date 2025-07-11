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
      await this.emailServices?.sendEmailWithVerificationCode(email, user._id)
      return {
        message:
          'Verification email required. Please, check your inbox to receive the verification code.',
        status: 202,
      }
    }

    const accessToken = genDefaultJwt({ id: user._id })
    const { token: refreshToken } = await this.refreshTokenServices.createToken({
      token: uuidv4(),
      userId: user._id,
    })

    const { password: _, ...userWithOutPassword } = user
    return {
      accessToken,
      refreshToken,
      user: userWithOutPassword,
      message: 'Log in successfuly!',
      status: 200,
    }
  }

  async verifyEmail(params: { email: string; verificationCode: string }) {
    const { email, verificationCode } = params

    const { _id } = await this.validateEmailUser(email)

    const codes = await this.codeServices.findCodeByUserId(_id)

    if (!codes || codes?.length <= 0)
      throw new HttpError(400, 'There is no code available for this user!')

    const codeContainInCodes = codes.find(code => code.code === verificationCode)
    if (!codeContainInCodes) throw new HttpError(400, 'Invalid verification code!')

    await this.codeServices.deleteAllCodesByUserId(_id)

    await this.usersRepository.updateById(_id, { emailVerified: true })

    return { message: 'Email verified successfuly!' }
  }

  async logout(params: { email: string }) {
    const { email } = params

    const user = await this.validateEmailUser(email)

    await this.refreshTokenServices.deleteTokensByUserId(user._id)

    return { message: 'Logout done successfuly!' }
  }

  async refresh(params: { email: string }) {
    const { email } = params

    const { _id } = await this.validateEmailUser(email)

    const tokens = await this.refreshTokenServices.getTokensByUserId(_id)
    if (tokens.length === 0) throw new HttpError(401, 'Session expired or user is logged out!')

    const accessToken = await genDefaultJwt({ id: _id })

    const { token: refreshToken } = await this.refreshTokenServices.createToken({
      token: uuidv4(),
      userId: _id,
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
    const { email, isWithGoogle, isWithFacebook } = params

    const user = await this.usersRepository.findByEmail(email)

    let message = ''
    if (isWithGoogle) message = 'Logged in with Google successfully!'
    if (isWithFacebook) message = 'Logged in with Facebook successfully!'

    if (!user) {
      const newUser = await this.usersRepository.create(params)
      const accessToken = genDefaultJwt({ id: newUser._id })

      const { token: refreshToken } = await this.refreshTokenServices.createToken({
        token: uuidv4(),
        userId: newUser._id,
      })

      const { password: _, ...restUser } = newUser

      return { user: restUser, accessToken, refreshToken, message, status: 201 }
    }

    if (user && !user.isWithFacebook && !user?.isWithGoogle) {
      const usedMethod = isWithGoogle ? 'Google' : isWithFacebook ? 'Facebook' : 'Social Login'
      throw new HttpError(
        400,
        `Email already registered with traditional login. Cannot use ${usedMethod}.`,
      )
    }

    const accessToken = genDefaultJwt({ id: user._id })

    const { token: refreshToken } = await this.refreshTokenServices.createToken({
      token: uuidv4(),
      userId: user._id,
    })

    const { password: _, ...restUser } = user

    return { user: restUser, accessToken, refreshToken, message, status: 200 }
  }

  async forgotPassword(params: { email: string }) {
    const { email } = params
    const { _id: userId } = await this.validateEmailUser(email)

    await this.emailServices?.sendEmailWithVerificationCode(email, userId)

    return { message: 'Verification code sent.' }
  }

  async resetPassword(params: { email: string; newPassword: string; verificationCode: string }) {
    const { email, newPassword, verificationCode } = params

    const { _id } = await this.validateEmailUser(email)

    const codes = await this.codeServices.findCodeByUserId(_id)

    if (!codes || codes?.length <= 0)
      throw new HttpError(400, 'There is no code available for this user!')

    const codeContainInCodes = codes.find(code => code.code === verificationCode)
    if (!codeContainInCodes) throw new HttpError(400, 'Invalid verification code!')

    await this.codeServices.deleteAllCodesByUserId(_id)

    const password = await bcrypt.hash(newPassword, 10)

    await this.usersRepository.updateById(_id, { password })

    return { message: 'Password successfuly reset.' }
  }
}
