import { Router } from 'express'
import { authController } from './container'
import { authGoogle } from '../middlewares/oauth-google-middleware'

const authRouter = Router()

// AUTH ROUTES
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/verify-email', authController.verify)
authRouter.post('/logout', authController.logout)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/forgot-password', authController.forgot)
authRouter.post('/reset-password', authController.reset)
authRouter.post('/social/google', authGoogle, authController.social)

export { authRouter }
