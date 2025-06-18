import { Handler } from 'express'
import { HttpError } from '../errors/HttpError'
import { OAuth2Client } from 'google-auth-library'

// create google client
const googleClient = new OAuth2Client()

// enviroments
const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUDIENCE

export const authGoogle: Handler = async (req, res, next) => {
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

    const payload = ticket.getPayload()
    const { email } = payload as any
    req.user = { email, isWithGoogle: true }

    next()
  } catch (error: any) {
    if (error.message.startsWith('Token used too late')) {
      return next(new HttpError(401, 'Expired token!'))
    }
    next(error)
  }
}
