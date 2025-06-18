import { Handler } from 'express'
import { HttpError } from '../errors/HttpError'
import { MongooseUsersRepository } from '../repositories/mongoose/MongooseUsersRepository'

const usersRepository = new MongooseUsersRepository()

export const validateUserByTask: Handler = async (req, res, next) => {
  try {
    const { id } = req.params
    const email = req.user?.email as string

    const user = await usersRepository.findById(email)
    if (!user) throw new HttpError(404, 'User not found!')

    if (user.role !== 'ADMIN') {
      throw new HttpError(401, 'Not authorized. Only admins can perform this operation.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
