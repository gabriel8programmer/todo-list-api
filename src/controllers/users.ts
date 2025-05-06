import { Handler } from "express";
import { Task, User } from "../models/schemas";
import { HttpError } from "../errors/HttpError";
import { z } from "zod";
import bcrypt from "bcrypt";
import { SaveTaskSchema } from "./tasks";

const SaveUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
});

const UpdateUserSchema = SaveUserSchema.partial();

const SaveUserTaskSchema = SaveTaskSchema.omit({ userId: true });

const UpdateUserTaskSchema = SaveUserTaskSchema.partial();

export class UsersController {
  static index: Handler = async (req, res, next) => {
    try {
      const data = await User.find({}).populate("tasks");
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  static show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id).populate("tasks");
      if (!user) throw new HttpError(404, "User not found!");

      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  static save: Handler = async (req, res, next) => {
    try {
      const body = SaveUserSchema.parse(req.body);

      // verify if user already exists in database
      const userExists = await User.findOne({ email: body.email });
      if (userExists) throw new HttpError(403, "User email address already exists!");

      //encrypt password
      body.password = await bcrypt.hash(body.password, 10);

      const newUser = new User(body);
      await newUser.save();

      res.status(201).json({ message: "User created successfuly!", data: newUser });
    } catch (error) {
      next(error);
    }
  };

  static update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const body = UpdateUserSchema.parse(req.body);

      // verify is user id is valid
      const user = await User.findById(id);
      if (!user) throw new HttpError(404, "User not found!");

      // verify if user already exists in database
      const userExists = await User.findOne({ email: body.email });
      if (userExists) throw new HttpError(403, "User email address already exists!");

      // if password field exists then encrypt password
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      //   update user
      const userUpdated = await User.findByIdAndUpdate(id, body);
      res.json({ message: "User updated successfuly!", data: userUpdated });
    } catch (error) {
      next(error);
    }
  };

  static delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;

      // verify is user id is valid
      const user = await User.findById(id);
      if (!user) throw new HttpError(404, "User not found!");

      // delete user
      await User.findByIdAndDelete(id);
      res.json({ message: "User delete successfuly!" });
    } catch (error) {
      next(error);
    }
  };

  static tasks: Handler = async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const tasks = await Task.find({ userId });

      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  static showTask: Handler = async (req, res, next) => {
    try {
      const { taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  static saveTask: Handler = async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const body = await SaveUserTaskSchema.parse(req.body);

      // create task
      const newTask = new Task({ ...body, userId });
      await newTask.save();

      // update user
      const user = await User.findById(userId);
      if (user) {
        const tasks = [...user.tasks, newTask._id];
        await User.updateOne({ userId }, { tasks });
      }

      res.json({ message: `Task created by user ${user?.name}`, data: newTask });
    } catch (error) {
      next(error);
    }
  };

  static updateTask: Handler = async (req, res, next) => {
    try {
      const { taskId } = req.params;
      const body = await UpdateUserTaskSchema.parse(req.body);

      const task = await Task.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      const updatedTask = await Task.findByIdAndUpdate(taskId, body);

      res.json({ message: "Task updated successfuly!", data: updatedTask });
    } catch (error) {
      next(error);
    }
  };

  static deleteTask: Handler = async (req, res, next) => {
    try {
      const { id: userId, taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) throw new HttpError(404, "Task not found!");

      // delete task
      await Task.findByIdAndDelete(taskId);

      // update user
      const userTasks = await Task.find({ userId });
      const tasks = userTasks.filter((task) => task._id.toString() !== taskId);
      await User.updateOne({ userId }, { tasks });

      res.json({ message: "Task deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
