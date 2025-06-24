import { MongooseUsersRepository } from '../repositories/mongoose/MongooseUsersRepository'
import { IUsersRepository } from '../repositories/UsersRepository'
import { AuthServices } from '../services/AuthServices'

let usersRepository: IUsersRepository
let authServices: AuthServices

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
  authServices = new AuthServices(usersRepository)
})

describe('Register user service', () => {
  it('Should be able to register a user', async () => {
    const data = await authServices.register({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    expect(data).toHaveProperty('id')
  })

  it('Should not be able to register a user with the same email', async () => {
    await authServices.register({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    await expect(
      authServices.register({ name: 'Teste 2', email: 'teste@gmail.com', password: '1235' }),
    ).rejects.toEqual(new Error('User with this email address already exists!'))
  })
})

describe('Login service', () => {
  it("Should be able to log in normaly if the user's email is verified", async () => {
    let exampleEmail = 'teste@gmail.com'
    let examplePassword = '123'

    const userRegistered = await authServices.register({
      name: 'Teste',
      email: exampleEmail,
      password: examplePassword,
    })

    //manipulating database to get expected response
    await usersRepository.updateById(userRegistered.id, { emailVerified: true })

    const data = await authServices.login({ email: exampleEmail, password: examplePassword })

    expect(data).toHaveProperty('accessToken')
    expect(data).toHaveProperty('refreshToken')
  })

  it('Should not be able to log in with user not existing', async () => {
    await expect(
      // this user was not been registered
      authServices.login({ email: 'teste@gmail.com', password: '123' }),
    ).rejects.toEqual(new Error('User not found!'))
  })

  it('Should not be able to log in if the user enters an invalid password', async () => {
    //this user is valid
    await authServices.register({
      name: 'Teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    await expect(
      // test with a valid email but a invalid password
      authServices.login({
        email: 'teste@gmail.com',
        password: '1234',
      }),
    ).rejects.toEqual(new Error('Invalid email or password!'))
  })
})
