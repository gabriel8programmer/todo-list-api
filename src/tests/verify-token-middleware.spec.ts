import { Handler, Request, Response } from 'express'
import { makeVerifyTokenMiddleware } from '../middlewares/verify-token-middleware'
import { IUsersRepository } from '../repositories/users-repository'
import { UserServices } from '../services/user-services'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { IRefreshTokensRepository } from '../repositories/refresh-tokens-repository'
import { MongooseRefreshTokensRepository } from '../repositories/mongoose/mongoose-refresh-tokens-repository'
import { HttpError } from '../errors/http-error'
import { genDefaultJwt } from '../utils/jwt/genDefaultJwt'

let usersRepository: IUsersRepository
let userServices: UserServices
let refreshTokensRepository: IRefreshTokensRepository
let verifyToken: Handler

beforeAll(async () => {
  usersRepository = new MongooseUsersRepository()
  userServices = new UserServices(usersRepository)
  refreshTokensRepository = new MongooseRefreshTokensRepository()
  verifyToken = await makeVerifyTokenMiddleware(userServices, refreshTokensRepository)
})

describe('Verify token middleware', () => {
  const mockReq = (token?: string) => {
    return { headers: { authorization: token ? `Bearer ${token}` : undefined } } as Request
  }

  const mockRes = () => {
    return {} as Response
  }

  const mockNext = jest.fn()

  it('Should not be able to verify empty token or malformed bearer token', async () => {
    const req = mockReq()
    const res = mockRes()

    await verifyToken(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(401)
    expect(errorPassed.message).toBe('Authorization token missing or malformed!')
  })

  it('Should not be able to verify a invalid token', async () => {
    //create a invalid token
    const fakeJwtToken = genDefaultJwt('teste')

    const req = mockReq(fakeJwtToken)
    const res = mockRes()

    await verifyToken(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(401)
    expect(errorPassed.message).toBe('Invalid token format!')
  })

  it('Should not be able to verify token with invalid user', async () => {
    //create valid jwt
    const fakeJwtToken = genDefaultJwt({ id: '1234' }) //invalid user id

    const req = mockReq(fakeJwtToken)
    const res = mockRes()

    await verifyToken(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(404)
    expect(errorPassed.message).toBe('User not found!')
  })

  it("Should not be able to verify token if the user isn't logged", async () => {
    //create fake user to force an existing a register in database
    const { user } = await userServices.createUser({
      name: 'teste',
      email: 'teste@gmail.com',
      password: '123',
    })

    //create fake token
    const fakeJwtToken = genDefaultJwt({ id: user.id })

    const req = mockReq(fakeJwtToken)
    const res = mockRes()

    await verifyToken(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(401)
    expect(errorPassed.message).toBe('Session expired or user is logged out!')
  })
})
