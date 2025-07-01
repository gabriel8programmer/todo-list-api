import { Handler } from 'express'
import { AuthServices } from '../services/auth-services'
import {
  ForgotBodySchema,
  LoginBodySchema,
  RegisterBodySchema,
  ResetBodySchema,
  SocialBodySchema,
  VerifyBodySchema,
} from '../schemas/auth-schemas'
import { userServices } from '../routes/container'

export class AuthController {
  constructor(private readonly authServices: AuthServices) {}

  register: Handler = async (req, res, next) => {
    try {
      const body = RegisterBodySchema.parse(req.body)
      const data = await this.authServices.register(body)
      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const body = LoginBodySchema.parse(req.body)
      const data = await this.authServices.login(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  verify: Handler = async (req, res, next) => {
    try {
      const body = VerifyBodySchema.parse(req.body)
      const data = await this.authServices.verifyEmail(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  logout: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  refresh: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  forgot: Handler = async (req, res, next) => {
    try {
      const body = ForgotBodySchema.parse(req.body)
      const data = await this.authServices.forgotPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  reset: Handler = async (req, res, next) => {
    try {
      const body = ResetBodySchema.parse(req.body)
      const data = await this.authServices.resetPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  social: Handler = async (req, res, next) => {
    try {
      const { name, email, emailVerified } = SocialBodySchema.parse(req.body)

      let data

      if (req.user) {
        const { isWithFacebook, isWithGoogle } = req.user
        data = await this.authServices.socialLogin({
          name,
          email,
          emailVerified,
          isWithGoogle,
          isWithFacebook,
        })
      }

      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
