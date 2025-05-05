import { Handler } from "express";
import { Task } from "../models/schemas";
import { z } from "zod";
import { HttpError } from "../errors/HttpError";

const SaveTaskSchema = z.object({
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
      const tasks = await Task.find({}).populate("userId");
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  static show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const task = await Task.findById(id);
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
      const updatedTask = await Task.findByIdAndUpdate(id, body);
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

      res.json({ message: "Task deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
