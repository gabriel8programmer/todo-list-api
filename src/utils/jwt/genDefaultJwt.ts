import jwt from 'jsonwebtoken'
import { EnvSchema } from '../../schemas/env-schemas'

const _jwt_key = EnvSchema.parse(process.env).JWT_SECRET_KEY || 'jwt_secret_key'

export const genDefaultJwt = (payload: { id: string }, expiresIn: any = '1d') => {
  return jwt.sign(payload, _jwt_key, { expiresIn })
}
