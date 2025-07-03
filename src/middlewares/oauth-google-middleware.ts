import { Handler } from 'express'
import { HttpError } from '../errors/http-error'
import { OAuth2Client, TokenPayload } from 'google-auth-library'
import { EnvSchema } from '../schemas/env-schemas'

// create google client
const googleClient = new OAuth2Client()

// enviroments
const GOOGLE_CLIENT_ID = EnvSchema.parse(process.env).GOOGLE_AUDIENCE

interface CustomTokenPayload extends TokenPayload {
  emailVerified?: boolean
  isWithGoogle: boolean
}

export const oAuthGoogle: Handler = async (req, res, next) => {
  try {
    const completedToken = req.headers.authorization
    if (!completedToken?.startsWith('Bearer')) throw new HttpError(400, 'Invalid bearer token!')

    // extract token
    const token = completedToken.split(' ')[1]
    if (!token) throw new HttpError(401, 'Invalid token!')

    // validate token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload() as CustomTokenPayload

    //define properties
    payload.emailVerified = payload.email_verified
    payload.isWithGoogle = true

    req.user = payload
    next()
  } catch (error: any) {
    if (error.message.startsWith('Token used too late')) {
      return next(new HttpError(401, 'Expired token!'))
    }
    next(error)
  }
}
