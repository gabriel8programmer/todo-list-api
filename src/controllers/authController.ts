import { Handler } from 'express'
import { AuthServices } from '../services/AuthServices'
import {
  LoginBodySchema,
  RegisterBodySchema,
  SocialBodySchema,
  VerifyBodySchema,
} from '../schemas/auth'

export class AuthController {
  constructor(private readonly authServices: AuthServices) {}

  register: Handler = async (req, res, next) => {
    try {
      const body = RegisterBodySchema.parse(req.body)
      const newUser = await this.authServices.register(body)
      res.json({ message: 'User create succesfuly. Log in Now!', data: newUser })
    } catch (error) {
      next(error)
    }
  }

  login: Handler = async (req, res, next): Promise<any> => {
    try {
      const body = LoginBodySchema.parse(req.body)
      const data = await this.authServices.login(body)

      if (data.requiresEmailVerification) {
        return res.json({
          message: 'Verification email required. Please, check your email inbox for to continue.',
        })
      }

      res.json({ message: 'Log in successfuly!', data })
    } catch (error) {
      next(error)
    }
  }

  verify: Handler = async (req, res, next) => {
    try {
      const body = VerifyBodySchema.parse(req.body)
      const data = await this.authServices.verifyLogin(body)
      res.json({ data, message: 'Login verified successfuly!' })
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
    } catch (error) {
      next(error)
    }
  }

  reset: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }

  social: Handler = async (req, res, next): Promise<void | any> => {
    try {
    } catch (error) {
      next(error)
    }
  }
}
