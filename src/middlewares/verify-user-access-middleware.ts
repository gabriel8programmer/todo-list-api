import { Handler } from 'express'
import { HttpError } from '../errors/http-error'

export function makeVerifyUserAccessMiddleware(): Handler {
  return (req, res, next) => {
    try {
      const { id } = req.params
      const userId = req.user?.id
      const role = req.user?.role

      if (id !== userId && role !== 'ADMIN') {
        throw new HttpError(
          403,
          'Access denied. Only the user or an administrator can perform this action.',
        )
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
