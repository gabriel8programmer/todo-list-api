import { Handler } from 'express'
import { HttpError } from '../errors/http-error'

export function makeVerifyAdminMiddleware(): Handler {
  return (req, res, next) => {
    try {
      const user = req?.user

      if (user?.role && user?.role !== 'ADMIN') {
        throw new HttpError(403, 'User request ADMIN permission for to perform this operation!')
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
