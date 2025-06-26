import request, { Response } from 'supertest'
import { app } from '../app'

let userRegisteredResponse: Response

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
    const res = await request(app).post('/api/auth/login').send({
      email: 'teste@gmail.com',
      password: '123',
    })

    //manipuling result

    expect(res.status).toBe(200)
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
