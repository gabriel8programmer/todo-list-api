import { Handler } from 'express'
import { TaskServices } from '../services/task-services'
import { SaveTaskRequestBodySchema, UpdateTaskRequestBodySchema } from '../schemas/task-schemas'

export class TasksController {
  constructor(private readonly taskServices: TaskServices) {}

  index: Handler = async (req, res, next) => {
    try {
      const tasks = await this.taskServices.getAllTasks()
      res.json(tasks)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const { taskId } = req.params
      const data = await this.taskServices.getTaskById(taskId)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  save: Handler = async (req, res, next) => {
    try {
      const body = SaveTaskRequestBodySchema.parse(req.body)
      const data = await this.taskServices.createTask(body)
      res.status(201).json(data)
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const { taskId } = req.params
      const body = UpdateTaskRequestBodySchema.parse(req.body)
      const data = await this.taskServices.updateTaskById(taskId, body)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next): Promise<any> => {
    try {
      const { taskId } = req.params
      const data = await this.taskServices.deleteTaskById(taskId)
      res.json(data)
    } catch (error) {
      next(error)
    }
  }

  deleteAll: Handler = async (req, res, next) => {
    try {
      const data = await this.taskServices.deleteAllTasks()
      res.json(data)
    } catch (error) {
      next(error)
    }
  }
}
