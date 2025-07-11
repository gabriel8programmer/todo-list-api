import request from 'supertest'
import { app } from '../app'
import { IUsersRepository } from '../repositories/users-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { CodeServices } from '../services/code-services'
import { ICodesRepository } from '../repositories/codes-repository'
import { MongooseCodesRepository } from '../repositories/mongoose/mongoose-codes-repository'
import {
  IRegisterCustomResponse,
  loginWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from './helpers/auth-helpers'
import { createFakeCodeWithUserId } from './helpers/code-helpers'

let usersRepository: IUsersRepository
let _userTester: IRegisterCustomResponse
let codesRepository: ICodesRepository
let codeServices: CodeServices

beforeAll(() => {
  usersRepository = new MongooseUsersRepository()
  codesRepository = new MongooseCodesRepository()
  codeServices = new CodeServices(codesRepository)
})

let userBaseData: any

beforeEach(async () => {
  userBaseData = {
    name: 'teste',
    email: 'teste@gmail.com',
    password: '123',
  }

  _userTester = await registerUserWithEmailAndPassword(userBaseData)
})

describe('Register controller method', () => {
  it('Should be able to register a user', async () => {
    expect(_userTester.status).toBe(201)
    expect(_userTester.body).toHaveProperty('user')
    expect(_userTester.body.user).toHaveProperty('_id')
  })

  it('Should not be able to register a user with the same email', async () => {
    const res = await registerUserWithEmailAndPassword(userBaseData)

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('User with this email address already exists!')
  })
})

describe('Login controller method', () => {
  it("Should be able to log in normaly if the user's email is verified", async () => {
    const { user } = _userTester.body
    await usersRepository.updateById(user._id, { emailVerified: true })

    const res = await loginWithEmailAndPassword(userBaseData)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
  })

  it("Should not be able to log in with user's email not verified", async () => {
    const res = await loginWithEmailAndPassword(userBaseData)

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toBeUndefined()
    expect(res.body.refreshToken).toBeUndefined()
    expect(res.body.message).toBe(
      'Verification email required. Please, check your inbox to receive the verification code.',
    )
  })

  it('Should not be able to log in with invalid email or password', async () => {
    const res = await loginWithEmailAndPassword({ ...userBaseData, email: 'teste123@gmail.com' })
    const res2 = await loginWithEmailAndPassword({ ...userBaseData, password: '321' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid email or password!')
    expect(res2.status).toBe(400)
    expect(res2.body.message).toBe('Invalid email or password!')
  })
})

describe('Verify email controller method', () => {
  it('Should be able to verify email', async () => {
    const { code: verificationCode } = await createFakeCodeWithUserId(
      codeServices,
      _userTester.body.user._id,
    )

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ ...userBaseData, verificationCode })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Email verified successfuly!')
  })

  it('Should not be able to verify invalid email', async () => {
    const { code: verificationCode } = await createFakeCodeWithUserId(
      codeServices,
      _userTester.body.user._id,
    )

    const res = await request(app).post('/api/auth/verify-email').send({
      email: 'teste123@gmail.com',
      verificationCode,
    })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found!')
  })

  it('Should not be able to verify email if the user did not request a code', async () => {
    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({ ...userBaseData, verificationCode: '1234' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('There is no code available for this user!')
  })

  it('Should not be able to verify email if the code is invalid', async () => {
    await createFakeCodeWithUserId(codeServices, _userTester.body.user._id)

    const res = await request(app)
      .post('/api/auth/verify-email')
      .send({
        ...userBaseData,
        verificationCode: '1234',
      })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid verification code!')
  })
})

describe('Logout controller method', () => {
  beforeAll(async () => {
    const { user } = _userTester.body
    await usersRepository.updateById(user._id, { emailVerified: true })

    await loginWithEmailAndPassword(userBaseData)
  })

  it('Should be able to logout', async () => {
    const res = await request(app).post('/api/auth/logout').send(userBaseData)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toBe('Logout done successfuly!')
  })

  it('Should not be able to logout with invalid email', async () => {
    const res = await request(app).post('/api/auth/logout').send({
      email: 'teste123@gmail.com', //invalid email
    })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found!')
  })
})

describe('Refresh controller method', () => {
  beforeEach(async () => {
    //manipuling body for to test
    const { user } = _userTester.body
    await usersRepository.updateById(user._id, { emailVerified: true })

    await loginWithEmailAndPassword(userBaseData)
  })

  it('Should be able to refresh tokens', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ email: 'teste@gmail.com' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('accessToken')
    expect(res.body).toHaveProperty('refreshToken')
    expect(res.body.message).toBe('Access tokens refreshed successfuly!')
  })

  it('Should not be able to refresh tokens with invalid email', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ email: 'teste123@gmail.com' })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found!')
  })

  it('Should not be able to refresh tokens if the user has not any refresh token saved', async () => {
    // logout for to force error when to try refresh tokens
    await request(app).post('/api/auth/logout').send({ email: 'teste@gmail.com' })

    const res = await request(app).post('/api/auth/refresh').send({ email: 'teste@gmail.com' })

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Session expired or user is logged out!')
  })
})

describe('Forgot password controller method', () => {
  it('Should be able to request a verification code for to reset password', async () => {
    const res = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: 'teste@gmail.com' })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Verification code sent.')
  })

  it('Should not be able to request a verification code with invalid email', async () => {
    const res = await request(app).post('/api/auth/forgot-password').send({
      email: 'teste1@gmail.com',
    })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found!')
  })
})

describe('Reset password controller method', () => {
  let code: string

  beforeEach(async () => {
    const { code: _code } = await createFakeCodeWithUserId(codeServices, _userTester.body.user._id)
    code = _code
  })

  it('Should be able to reset password', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ ...userBaseData, newPassword: '321', verificationCode: code })

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Password successfuly reset.')
  })

  it('Should not be able to reset password with invalid email', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      email: 'teste1@gmail.com',
      newPassword: '321',
      verificationCode: code,
    })

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('User not found!')
  })

  it('Should not be able to reset password if the user has not requested the verification code', async () => {
    await codeServices.deleteAllCodesByUserId(_userTester.body.user._id)

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ ...userBaseData, newPassword: '321', verificationCode: code })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('There is no code available for this user!')
  })

  it("Should not be able to reset password if the user's code is invalid", async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ ...userBaseData, newPassword: '321', verificationCode: '1234' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Invalid verification code!')
  })
})
