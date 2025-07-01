import request, { Response } from 'supertest'
import { app } from '../app'
import { IUsersRepository } from '../repositories/users-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'

let usersRepository: IUsersRepository
let userRegisteredResponse: Response

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
})

beforeEach(async () => {
  userRegisteredResponse = await request(app).post('/api/auth/register').send({
    name: 'teste',
    email: 'teste@gmail.com',
    password: '123',
  })
})

describe('Register controller method', () => {
  it('Should be able to register a user', async () => {
    expect(userRegisteredResponse.status).toBe(201)
    expect(userRegisteredResponse.body).toHaveProperty('user')
    expect(userRegisteredResponse.body.user).toHaveProperty('id')
  })

  it('Should not be able to register a user with the same email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('User with this email address already exists!')
  })
})

describe('Login controller method', () => {
  it("Should be able to log in normaly if the user's email is verified", async () => {
    //manipuling body for to test
    const { user } = userRegisteredResponse.body
    await usersRepository.updateById(user.id, { emailVerified: true })

    const res = await request(app).post('/api/auth/login').send({
      email: 'teste@gmail.com',
      password: '123',
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it("Should not be able to log in with user's email not verified", async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'teste@gmail.com',
      password: '123',
    })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeUndefined()
    expect(res.body.refreshToken).toBeUndefined()
    expect(res.body.message).toBe(
      'Verification email required. Please, check your inbox to receive the verification code.',
    )
  })

  it('Should not be able to log in with invalid email or password', async () => {
    let res

    res = await request(app).post('/api/auth/login').send({
      email: 'teste1@gmail.com', //invalid email
      password: '123', //valid password
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid email or password!')

    res = await request(app).post('/api/auth/login').send({
      email: 'teste@gmail.com', // valid email
      password: '1234', //invalid password
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid email or password!')
  })
})

//describe('Verify login controller method', () => {})

//describe('Forgot password controller method', () => {})
//describe('Reset password controller method', () => {})
