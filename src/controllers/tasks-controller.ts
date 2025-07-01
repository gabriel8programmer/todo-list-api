import { Handler } from 'express'
import { TaskServices } from '../services/task-services'

export class TasksController {
  constructor(private readonly taskServices: TaskServices) {}

  all: Handler = async (req, res, next) => {
    try {
      const tasks = await this.taskServices.getAllTasks()
      res.json({ data: tasks })
    } catch (error) {
      next(error)
    }
  }

  index: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const tasks = await this.taskServices.getTaskById(id)
      res.json(tasks)
    } catch (error) {
      next(error)
    }
  }

  show: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params
    } catch (error) {
      next(error)
    }
  }

  save: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
    } catch (error) {
      next(error)
    }
  }

  update: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params
    } catch (error) {
      next(error)
    }
  }

  delete: Handler = async (req, res, next): Promise<any> => {
    try {
      const { id, taskId } = req.params
    } catch (error) {
      next(error)
    }
  }

  deleteAll: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
    } catch (error) {
      next(error)
    }
  }
}
