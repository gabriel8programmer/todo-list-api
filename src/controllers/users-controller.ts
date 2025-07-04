import { Handler } from 'express'
import { UserServices } from '../services/user-services'
import { SaveUserSchema, UpdateUserSchema } from '../schemas/user-schemas'

export class UsersController {
  constructor(private readonly userServices: UserServices) {}

  index: Handler = async (req, res, next) => {
    try {
      const users = await this.userServices.getAllUsers()
      res.json({ data: users })
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await this.userServices.getUserById(id)
      res.json({ data: user })
    } catch (error) {
      next(error)
    }
  }

  save: Handler = async (req, res, next) => {
    try {
      const body = SaveUserSchema.parse(req.body)
      const data = await this.userServices.createUser(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      const body = UpdateUserSchema.parse(req.body)
      const data = await this.userServices.updateUserById(id, body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      const data = await this.userServices.deleteUserById(id)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  deleteAll: Handler = async (req, res, next) => {
    try {
      const data = await this.userServices.deleteAllUsers()
      res.json({})
    } catch (error) {
      next(error)
    }
  }
}
