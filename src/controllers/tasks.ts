import { Handler } from "express";
import { Task, User } from "../models/schemas";
import { z } from "zod";
import { HttpError } from "../errors/HttpError";

export const SaveTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["todo", "doing", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  userId: z.string().optional(),
});

const UpdateTaskSchema = SaveTaskSchema.partial();

export class TasksController {
  static index: Handler = async (req, res, next) => {
    try {
      const tasks = await Task.find({});
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  static show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id).populate("userId");
      if (!task) throw new HttpError(404, "Task not found!");

      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  static save: Handler = async (req, res, next) => {
    try {
      const body = SaveTaskSchema.parse(req.body);
      const newTask = new Task(body);
      await newTask.save();

      if (body.userId) {
        const { userId: id } = body;
        // update tasks list in user with userId
        const user = await User.findById(id);
        if (!user) throw new HttpError(404, `User with id (${id}) not found!`);

        const tasks = [...user.tasks, newTask._id];
        await User.findByIdAndUpdate(id, { tasks });
      }

      res.status(201).json({ message: "Task created successfuly!", data: newTask });
    } catch (error) {
      next(error);
    }
  };

  static update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id);
      if (!task) throw new HttpError(404, "Task not found!");

      const body = UpdateTaskSchema.parse(req.body);
      //   update task
      const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
      res.json({ message: "Updated task successfuly!", data: updatedTask });
    } catch (error) {
      next(error);
    }
  };

  static delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id);
      if (!task) throw new HttpError(404, "Task not found!");

      //   delete task
      await Task.findByIdAndDelete(id);

      // if task has a user then delete too
      if (task.userId) {
        const { userId: id } = task;
        // update tasks list in user with userId
        const user = await User.findById(id);
        if (!user) throw new HttpError(404, `User with id (${id}) not found!`);

        const tasks = user.tasks.filter((t) => t.id !== task.id);
        await User.findByIdAndUpdate(id, { tasks });
      }

      res.json({ message: "Task deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
