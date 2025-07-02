import { Handler } from 'express'
import { AuthServices } from '../services/auth-services'
import {
  ForgotBodyRequestSchema,
  LoginBodyRequestSchema,
  RegisterBodyRequestSchema,
  ResetBodyRequestSchema,
  SocialUserRequestSchema,
  VerifyBodyRequestSchema,
} from '../schemas/auth-schemas'

export class AuthController {
  constructor(private readonly authServices: AuthServices) {}

  register: Handler = async (req, res, next) => {
    try {
      const body = RegisterBodyRequestSchema.parse(req.body)
      const data = await this.authServices.register(body)
      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  }

  login: Handler = async (req, res, next) => {
    try {
      const body = LoginBodyRequestSchema.parse(req.body)
      const data = await this.authServices.login(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  verify: Handler = async (req, res, next) => {
    try {
      const body = VerifyBodyRequestSchema.parse(req.body)
      const data = await this.authServices.verifyEmail(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  logout: Handler = async (req, res, next) => {
    try {
      const body = LoginBodyRequestSchema.parse(req.body)
      const data = await this.authServices.logout(body)
      res.json(data)
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
      const body = ForgotBodyRequestSchema.parse(req.body)
      const data = await this.authServices.forgotPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  reset: Handler = async (req, res, next) => {
    try {
      const body = ResetBodyRequestSchema.parse(req.body)
      const data = await this.authServices.resetPassword(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  social: Handler = async (req, res, next) => {
    try {
      const user = SocialUserRequestSchema.parse(req.user)
      const data = await this.authServices.socialLogin(user)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
