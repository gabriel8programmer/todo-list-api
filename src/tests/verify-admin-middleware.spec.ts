import { Handler, Request, Response } from 'express'
import { IUsersRepository } from '../repositories/users-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { IUserRequest } from '../types/express'
import { HttpError } from '../errors/http-error'
import { makeVerifyAdminMiddleware } from '../middlewares/verify-admin-middleware'

let usersRepository: IUsersRepository
let verifyAdmin: Handler

beforeAll(async () => {
  usersRepository = new MongooseUsersRepository()
  verifyAdmin = makeVerifyAdminMiddleware()
})

describe('Verify user access middleware', () => {
  const mockReq = (user: IUserRequest) =>
    ({
      user: user,
    } as Partial<Request> as Request)

  const mockRes = () => {
    return {} as Response
  }

  const mockNext = jest.fn()

  it('Should not be able the user perform a operation in other user with out admin credentials', async () => {
    //create user for to test
    const user = await usersRepository.create({
      name: 'teste',
      email: 'test@gmail.com.com',
      password: '123',
      role: 'CLIENT',
    })

    const req = mockReq(user) //user client
    const res = mockRes()

    verifyAdmin(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(403)
    expect(errorPassed.message).toBe('User request ADMIN permission for to perform this operation!')
  })
})
