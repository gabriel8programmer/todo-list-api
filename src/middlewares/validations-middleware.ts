import { Handler } from 'express'
import { HttpError } from '../errors/http-error'
import { MongooseUsersRepository } from '../repositories/mongoose/mongoose-users-repository'

const usersRepository = new MongooseUsersRepository()

export const validateUserByTask: Handler = async (req, res, next) => {
  try {
    const { id } = req.params

    const user = await usersRepository.findById(id)
    if (!user) throw new HttpError(404, 'User not found!')

    if (user.role !== 'ADMIN') {
      throw new HttpError(401, 'Not authorized. Only admins can perform this operation.')
    }

    next()
  } catch (error) {
    next(error)
  }
}
