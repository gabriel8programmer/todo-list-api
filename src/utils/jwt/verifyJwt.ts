import { EnvSchema } from '../../schemas/env'
import jwt from 'jsonwebtoken'

const _jwt_key = EnvSchema.parse(process.env).JWT_SECRET_KEY || 'jwt_secret_key'

export const verifyJwt = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, _jwt_key)
}
