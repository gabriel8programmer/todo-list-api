import { Handler } from 'express'
import { UserServices } from '../services/UserServices'
import { SaveUserSchema, UpdateUserSchema } from '../schemas/users'

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
      const newUser = await this.userServices.createUser(body)
      res.json({ message: 'User created successfuly!', data: newUser })
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      const body = UpdateUserSchema.parse(req.body)
      const updatedUser = await this.userServices.updateUserById(id, body)
      res.json({ message: 'User updated successfuly!', data: updatedUser })
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      await this.userServices.deleteUserById(id)
      res.json({ message: 'User deleted successfuly!' })
    } catch (error) {
      next(error)
    }
  }
}
