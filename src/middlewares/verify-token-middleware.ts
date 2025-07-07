import { Handler } from 'express'
import { HttpError } from '../errors/http-error'
import { verifyJwt } from '../utils/jwt/verifyJwt'
import { UserServices } from '../services/user-services'
import { JwtPayload } from 'jsonwebtoken'
import { IRefreshTokensRepository } from '../repositories/refresh-tokens-repository'

interface CustomJwtPayload extends JwtPayload {
  id: string
}

export function makeVerifyTokenMiddleware(
  userServices: UserServices,
  refreshTokensRepository: IRefreshTokensRepository,
): Handler {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization

      //validate headers
      if (!authHeader || !authHeader.startsWith('Bearer'))
        throw new HttpError(401, 'Authorization token missing or malformed!')

      const token = authHeader.split(' ')[1]

      //decrypt token
      const tokenDecoded = (await verifyJwt(token)) as CustomJwtPayload

      if (typeof tokenDecoded === 'string') throw new HttpError(401, 'Invalid token format!')

      //validate user
      const user = await userServices.getUserById(tokenDecoded.id)

      //verify if the user is logged
      const tokens = await refreshTokensRepository.findByUserId(user._id)
      if (tokens.length === 0) throw new HttpError(401, 'Session expired or user is logged out!')

      //save user in request
      req.user = user
      next()
    } catch (error: any) {
      if (error.message.startsWith('Token used too late')) {
        return next(new HttpError(401, 'Expired token!'))
      }
      next(error)
    }
  }
}
