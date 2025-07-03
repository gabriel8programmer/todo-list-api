require('dotenv').config()

import jwt from 'jsonwebtoken'
import { EnvSchema } from '../../schemas/env-schemas'

const _jwt_key = EnvSchema.parse(process.env).JWT_SECRET_KEY || 'jwt_secret_key'

export interface DefaultPayload {
  id?: string
}

export const genDefaultJwt = (payload: DefaultPayload | string, expiresIn: any = '1d') => {
  if (typeof payload === 'object') {
    return jwt.sign(payload, _jwt_key, { expiresIn })
  } else {
    return jwt.sign(payload, _jwt_key)
  }
}
