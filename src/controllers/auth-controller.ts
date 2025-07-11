import { Handler } from 'express'
import { AuthServices } from '../services/auth-services'
import {
  ForgotRequestBodySchema,
  LoginRequestBodySchema,
  LogoutRequestBodySchema,
  RefreshRequestBodySchema,
  RegisterRequestBodySchema,
  ResetRequestBodySchema,
  SocialRequestUserSchema,
  VerifyRequestBodySchema,
} from '../schemas/auth-schemas'

export class AuthController {
  constructor(private readonly authServices: AuthServices) {}

  register: Handler = async (req, res, next) => {
    try {
      const body = RegisterRequestBodySchema.parse(req.body)
      const data = await this.authServices.register(body)
      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const body = LoginRequestBodySchema.parse(req.body)
      const data = await this.authServices.login(body)
      res.status(data.status).json(data)
    } catch (error) {
      next(error)
    }
  }

  verify: Handler = async (req, res, next) => {
    try {
      const body = VerifyRequestBodySchema.parse(req.body)
      const data = await this.authServices.verifyEmail(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  logout: Handler = async (req, res, next) => {
    try {
      const body = LogoutRequestBodySchema.parse(req.body)
      const data = await this.authServices.logout(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  refresh: Handler = async (req, res, next) => {
    try {
      const body = RefreshRequestBodySchema.parse(req.body)
      const data = await this.authServices.refresh(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  forgot: Handler = async (req, res, next) => {
    try {
      const body = ForgotRequestBodySchema.parse(req.body)
      const data = await this.authServices.forgotPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  reset: Handler = async (req, res, next) => {
    try {
      const body = ResetRequestBodySchema.parse(req.body)
      const data = await this.authServices.resetPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  social: Handler = async (req, res, next) => {
    try {
      const user = SocialRequestUserSchema.parse(req.user)
      const data = await this.authServices.socialLogin(user)
      res.status(data.status).json(data)
    } catch (error) {
      next(error)
    }
  }
}
