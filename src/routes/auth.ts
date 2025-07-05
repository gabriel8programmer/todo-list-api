import { Router } from 'express'
import { authController } from './container'
import { oAuthGoogle as google } from '../middlewares/oauth-google-middleware'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/verify-email', authController.verify)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refresh)
router.post('/forgot-password', authController.forgot)
router.post('/reset-password', authController.reset)
router.post('/social/google', google, authController.social)

export { router as authRouter }
