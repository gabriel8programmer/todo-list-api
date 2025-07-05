import { Handler, Request, Response } from 'express'
import { IUsersRepository } from '../repositories/users-repository'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'
import { IUserRequest } from '../types/express'
import { makeVerifyUserAccessMiddleware } from '../middlewares/verify-user-access-middleware'
import { HttpError } from '../errors/http-error'

let usersRepository: IUsersRepository
let verifyUserAccess: Handler

beforeAll(async () => {
  usersRepository = new MongooseUsersRepository()
  verifyUserAccess = makeVerifyUserAccessMiddleware()

  //create users for to test
  await usersRepository.create({ name: 'user1', email: 'user1@gmail.com', password: '123' })
  await usersRepository.create({ name: 'user2', email: 'user2@gmail.com', password: '123' })
})

describe('Verify user access middleware', () => {
  const mockReq = (id: string, user: IUserRequest) =>
    ({
      params: { id },
      user: user,
    } as Partial<Request> as Request)

  const mockRes = () => {
    return {} as Response
  }

  const mockNext = jest.fn()

  it('Should not be able the user perform a operation in other user with out admin credentials', async () => {
    const users = await usersRepository.find()
    //get user ids
    const userId = users[0].id
    const user2 = users[1]

    //test userId of the user1 with userId of the user2
    const req = mockReq(userId, user2)
    const res = mockRes()

    verifyUserAccess(req, res, mockNext)

    const errorPassed = mockNext.mock.lastCall[0]

    expect(errorPassed).toBeInstanceOf(HttpError)
    expect(errorPassed.status).toBe(403)
    expect(errorPassed.message).toBe(
      'Access denied. Only the user or an administrator can perform this action.',
    )
  })
})
