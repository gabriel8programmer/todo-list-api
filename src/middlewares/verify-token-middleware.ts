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

      //save user in request
      const user = await userServices.getUserById(tokenDecoded.id)

      const tokens = await refreshTokensRepository.findByUserId(user.id)
      if (tokens.length === 0) throw new HttpError(401, 'Session expired or user is logged out!')

      req.user = user
      next()
    } catch (error) {
      next(error)
    }
  }
}
