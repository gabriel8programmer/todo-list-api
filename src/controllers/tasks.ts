import { Handler } from "express";
import { z } from "zod";
import { HttpError } from "../errors/HttpError";
import { TasksModel } from "../models/tasks";
import { UsersModel } from "../models/users";

export const SaveTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "doing", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("low"),
});

const UpdateTaskSchema = SaveTaskSchema.partial();

export class TasksController {
  static all: Handler = async (req, res, next) => {
    try {
      const tasks = await TasksModel.find();
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  static index: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const tasks = await TasksModel.findByUserId(id);
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  static show: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params;
      const task = await TasksModel.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      const data = await TasksModel.findById(taskId);

      const user = data?.user;
      let userData = {};
      if (user) {
        const { name, email, role, isWithFacebook, isWithGoogle } = user;
        userData = { name, email, role, isWithFacebook, isWithGoogle };
      }

      res.json({ ...data, user: userData });
    } catch (error) {
      next(error);
    }
  };

  static save: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = await SaveTaskSchema.parse(req.body);

      // create task
      const newTask = await TasksModel.create({ ...body, user: id });
      // update user tasksf
      await UsersModel.updateTasksFromUser(id);

      res.json({ message: `Task created successfuly`, data: newTask });
    } catch (error) {
      next(error);
    }
  };

  static update: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params;

      const task = await TasksModel.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      const body = await UpdateTaskSchema.parse(req.body);
      const updatedTask = await TasksModel.updateByUserIdAndTaskId(id, taskId, body);
      res.json({ message: "Task updated successfuly!", data: updatedTask });
    } catch (error) {
      next(error);
    }
  };

  static delete: Handler = async (req, res, next) => {
    try {
      const { id, taskId } = req.params;

      const task = await TasksModel.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      // delete task
      await TasksModel.deleteByUserIdAndTaskId(id, taskId);
      // delete task in user too
      await UsersModel.deleteTaskFromUser(id, taskId);

      res.json({ message: "Task deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };

  static deleteAll: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      await TasksModel.deleteAllTasksFromUserById(id);
      res.json({ message: "All tasks were deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
