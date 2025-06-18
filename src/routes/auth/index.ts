import { Router } from 'express'
import { authController } from '../container'
import { authGoogle } from '../../middlewares/oAuthGoogleMiddleware'

const authRouter = Router()

// AUTH ROUTES
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/verify-login', authController.verify)
authRouter.post('/refresh', authController.refresh)
authRouter.post('/forgot-password', authController.forgot)
authRouter.post('/reset-password', authController.reset)
authRouter.post('/social/google', authGoogle, authController.social)
// router.post("/social/facebook",authController.social);

export { authRouter }
