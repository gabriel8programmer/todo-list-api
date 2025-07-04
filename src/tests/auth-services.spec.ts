import { ICodesRepository } from '../repositories/codes-repository'
import { MongooseCodesRepository } from '../repositories/mongoose/mongoose-codes-repository'
import { MongooseRefreshTokensRepository } from '../repositories/mongoose/mongoose-refresh-tokens-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { IRefreshTokensRepository } from '../repositories/refresh-tokens-repository'
import { IUser, IUsersRepository } from '../repositories/users-repository'
import { AuthServices } from '../services/auth-services'
import { CodeServices } from '../services/code-services'
import { RefreshTokenServices } from '../services/refresh-token-services'

let usersRepository: IUsersRepository
let codesRepository: ICodesRepository
let refreshTokensRepository: IRefreshTokensRepository
let codeServices: CodeServices
let authServices: AuthServices
let refreshTokenServices: RefreshTokenServices

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
  codesRepository = new MongooseCodesRepository()
  refreshTokensRepository = new MongooseRefreshTokensRepository()
  refreshTokenServices = new RefreshTokenServices(refreshTokensRepository)
  codeServices = new CodeServices(codesRepository)
  authServices = new AuthServices(usersRepository, refreshTokenServices, codeServices)
})

const registerUserTest = async (overrides?: {}): Promise<{ user: IUser; message: string }> => {
  return await authServices.register({
    name: 'Teste',
    email: 'teste@gmail.com',
    password: '123',
    ...overrides,
  })
}

let userRegistered: IUser

jest.mock('')

beforeEach(async () => {
  userRegistered = (await registerUserTest()).user
})

describe('Register user service', () => {
  it('Should be able to register a user', async () => {
    expect(userRegistered).toHaveProperty('id')
  })

  it('Should not be able to register a user with the same email', async () => {
    await expect(
      authServices.register({ name: 'Teste 2', email: 'teste@gmail.com', password: '1235' }),
    ).rejects.toThrow('User with this email address already exists!')
  })
})

describe('Login service', () => {
  it("Should be able to log in normaly if the user's email is verified", async () => {
    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, { emailVerified: true })

    //email and password valids
    const data = await authServices.login({ email: 'teste@gmail.com', password: '123' })

    expect(data).toHaveProperty('accessToken')
    expect(data).toHaveProperty('refreshToken')
  })

  it('Should not be able to log in for this user already authenticated with social method', async () => {
    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, {
      isWithFacebook: true,
      isWithGoogle: true,
    })

    //email and password valids
    await expect(authServices.login({ email: 'teste@gmail.com', password: '123' })).rejects.toThrow(
      'User already authenticated with social method!',
    )
  })

  it("Should not log in if the user's email is not verified", async () => {
    //email and password valids
    const data = await authServices.login({ email: 'teste@gmail.com', password: '123' })

    expect(data).toHaveProperty('requiresEmailVerification')
    expect(data.accessToken).toBe(undefined)
    expect(data.refreshToken).toBe(undefined)
    expect(data.user).toBe(undefined)
  })

  it('Should not be able to log in if the user enters an invalid email or password', async () => {
    await expect(
      // test with a invalid email but a valid password
      authServices.login({
        email: 'teste1@gmail.com', // this is wrong
        password: '123', // this is OK
      }),
    ).rejects.toThrow('Invalid email or password!')

    await expect(
      // test with a valid email but a invalid password
      authServices.login({
        email: 'teste@gmail.com', // this is OK
        password: '1234', // this is wrong
      }),
    ).rejects.toThrow('Invalid email or password!')
  })
})

describe('Verify email service', () => {
  it("Should be able to verify email when the user doesn't have verified email", async () => {
    // create manual code in database
    const randomCode = codeServices.getRandomCodeWithLength(4)
    const code = await codeServices.create({ code: randomCode, userId: userRegistered.id })

    //get result
    const result = await authServices.verifyEmail({
      email: 'teste@gmail.com',
      verificationCode: code.code,
    })

    expect(result.message).toBe('Email verified successfuly!')
  })

  it('Should not be able to verify email with invalid email', async () => {
    await expect(
      authServices.verifyEmail({
        email: 'teste1@gmail.com', // invalid email
        verificationCode: '1234', // dummy code
      }),
    ).rejects.toThrow('User not found!')
  })

  it('Should not be able to verify email if the user did not request a code', async () => {
    // create manual code in database
    const randomCode = codeServices.getRandomCodeWithLength(4)
    const code = await codeServices.create({ code: randomCode, userId: userRegistered.id })

    // delete the code to force the error
    await codeServices.deleteAllCodesByUserId(code.userId)

    //try to verify login
    await expect(
      authServices.verifyEmail({
        email: 'teste@gmail.com',
        verificationCode: code.code,
      }),
    ).rejects.toThrow('There is no code available for this user!')
  })

  it('Should not be able to verify email if the code is invalid', async () => {
    // create manual code in database
    const randomCode = codeServices.getRandomCodeWithLength(4)
    const code = await codeServices.create({ code: randomCode, userId: userRegistered.id })

    //try to verify login
    await expect(
      authServices.verifyEmail({
        email: 'teste@gmail.com',
        verificationCode: '1234', //invalid code
      }),
    ).rejects.toThrow('Invalid verification code!')
  })
})

describe('Logout service', () => {
  beforeEach(async () => {
    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, { emailVerified: true })

    //valid login
    await authServices.login({ email: 'teste@gmail.com', password: '123' })
  })

  it('Should be able to logout', async () => {
    const data = await authServices.logout({ email: 'teste@gmail.com' })
    expect(data.message).toBe('Logout done successfuly!')
  })

  it('Should not be able to logout with invalid email', async () => {
    await expect(authServices.logout({ email: 'teste123@gmail.com' })).rejects.toThrow(
      'User not found!',
    )
  })
})

describe('Refresh service', () => {
  beforeEach(async () => {
    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, { emailVerified: true })

    //valid login
    await authServices.login({ email: 'teste@gmail.com', password: '123' })
  })

  it('Should be able to refresh tokens', async () => {
    const data = await authServices.refresh({ email: 'teste@gmail.com' })

    expect(data).toHaveProperty('accessToken')
    expect(data).toHaveProperty('refreshToken')
    expect(data.message).toBe('Access tokens refreshed successfuly!')
  })

  it('Should not be able to refresh tokens with invalid email', async () => {
    await expect(authServices.refresh({ email: 'teste123@gmail.com' })).rejects.toThrow(
      'User not found!',
    )
  })

  it('Should not be able to refresh tokens if the user has not any refresh token saved', async () => {
    // logout for to force error when to try refresh tokens
    await authServices.logout({ email: 'teste@gmail.com' })

    await expect(authServices.refresh({ email: 'teste@gmail.com' })).rejects.toThrow(
      'Session expired or user is logged out!',
    )
  })
})

describe('Forgot password service', () => {
  it('Should be able to request a verification code for to reset password', async () => {
    const data = await authServices.forgotPassword({ email: userRegistered.email })
    expect(data).toHaveProperty('message')
    expect(data.message).toBe('Verification code sent.')
  })

  it('Should not be able to request a verification code with invalid email', async () => {
    await expect(authServices.forgotPassword({ email: 'teste1@gmail.com' })).rejects.toThrow(
      'User not found!',
    )
  })
})

describe('Reset password service', () => {
  let code: string

  //code required
  beforeEach(async () => {
    code = codeServices.getRandomCodeWithLength(4)
    await codeServices.create({ code, userId: userRegistered.id })
  })

  it('Should be able to reset password', async () => {
    const data = await authServices.resetPassword({
      email: userRegistered.email,
      newPassword: '321', // new password
      verificationCode: code,
    })

    expect(data).toHaveProperty('message')
    expect(data.message).toBe('Password successfuly reset.')
  })

  it('Should not be able to reset password with invalid email', async () => {
    await expect(
      authServices.resetPassword({
        email: 'teste1@gmail.com', //invalid email
        newPassword: '321', // valid password
        verificationCode: code, // valid code
      }),
    ).rejects.toThrow('User not found!')
  })

  it('Should not be able to reset password if the user has not requested the verification code', async () => {
    //delete codes for this user for to test
    await codeServices.deleteAllCodesByUserId(userRegistered.id)

    await expect(
      authServices.resetPassword({
        email: userRegistered.email, //valid email
        newPassword: '321', // valid password
        verificationCode: code, // the code no longer exists
      }),
    ).rejects.toThrow('There is no code available for this user!')
  })

  it("Should not be able to reset password if the user's code is invalid", async () => {
    await expect(
      authServices.resetPassword({
        email: userRegistered.email, //valid email
        newPassword: '321', // valid password
        verificationCode: '1234', // invalid code
      }),
    ).rejects.toThrow('Invalid verification code!')
  })
})
