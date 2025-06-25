import { ICodesRepository } from '../repositories/CodesRepository'
import { MongooseCodesRepository } from '../repositories/mongoose/MongooseCodesRepository'
import { MongooseUsersRepository } from '../repositories/mongoose/MongooseUsersRepository'
import { IUser, IUsersRepository } from '../repositories/UsersRepository'
import { AuthServices } from '../services/AuthServices'
import { CodeServices } from '../services/CodeServices'

let usersRepository: IUsersRepository
let codesRepository: ICodesRepository
let codeServices: CodeServices
let authServices: AuthServices

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
  codesRepository = new MongooseCodesRepository()
  codeServices = new CodeServices(codesRepository)
  authServices = new AuthServices(usersRepository, codeServices)
})

const registerUserTest = async (overrides?: {}): Promise<IUser> => {
  return await authServices.register({
    name: 'Teste',
    email: 'teste@gmail.com',
    password: '123',
    ...overrides,
  })
}

describe('Register user service', () => {
  let userRegistered: IUser

  beforeEach(async () => {
    userRegistered = await registerUserTest()
  })

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
  let userRegistered: IUser

  beforeEach(async () => {
    userRegistered = await registerUserTest()
  })

  it("Should be able to log in normaly if the user's email is verified", async () => {
    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, { emailVerified: true })

    //email and password valids
    const data = await authServices.login({ email: 'teste@gmail.com', password: '123' })

    expect(data).toHaveProperty('accessToken')
    expect(data).toHaveProperty('refreshToken')
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

describe('Verify login service', () => {
  let userRegistered: IUser

  beforeEach(async () => {
    userRegistered = await registerUserTest()
  })

  it("Should be able to verify login when the user doesn't have verified email", async () => {
    // create manual code in database
    const randomCode = codeServices.getRandomCodeWithLength(4)
    const code = await codeServices.create({ code: randomCode, userId: userRegistered.id })

    //get result
    const result = await authServices.verifyLogin({
      email: 'teste@gmail.com',
      verificationCode: code.code,
    })

    expect(result).toHaveProperty('accessToken')
    expect(result).toHaveProperty('refreshToken')
  })

  it('Should not be able to verify login with invalid email', async () => {
    await expect(
      authServices.verifyLogin({
        email: 'teste1@gmail.com', // invalid email
        verificationCode: '1234', // dummy code
      }),
    ).rejects.toThrow('User not found!')
  })

  it('Should not be able to verify login if the user did not request a code', async () => {
    // create manual code in database
    const randomCode = codeServices.getRandomCodeWithLength(4)
    const code = await codeServices.create({ code: randomCode, userId: userRegistered.id })

    // delete the code to force the error
    await codeServices.deleteAllCodesByUserId(code.userId)

    //try to verify login
    await expect(
      authServices.verifyLogin({
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
      authServices.verifyLogin({
        email: 'teste@gmail.com',
        verificationCode: '1234', //invalid code
      }),
    ).rejects.toThrow('Invalid verification code!')
  })
})
