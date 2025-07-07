import { Handler } from 'express'
import { UserServices } from '../services/user-services'
import {
  AddTaskRequestBodySchema,
  SaveUserRequestBodySchema,
  UpdateTaskRequestBodySchema,
  UpdateUserRequestBodySchema,
} from '../schemas/user-schemas'

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
      const body = SaveUserRequestBodySchema.parse(req.body)
      const data = await this.userServices.createUser(body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id
      const body = UpdateUserRequestBodySchema.parse(req.body)
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
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  tasks: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const data = await this.userServices.getTasksFromUserById(id)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  showTask: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params
      const data = await this.userServices.getTaskFromUserByIdWithTaskId(id, taskId)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  addTask: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const body = AddTaskRequestBodySchema.parse(req.body)
      const data = await this.userServices.createTaskFromUserById(id, body)
      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  }

  updateTask: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params
      const body = UpdateTaskRequestBodySchema.parse(req.body)
      const data = await this.userServices.updateTaskFromUserByIdWithTaskId(id, taskId, body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  removeTask: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params
      const data = await this.userServices.removeTaskFromUserByIdWithTaskId(id, taskId)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  removeAllTasks: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const data = await this.userServices.removeAllTasksFromUserById(id)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
