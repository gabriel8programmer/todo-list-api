import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { z } from "zod";
import bcrypt from "bcrypt";
import { IUserPopulated, UsersModel } from "../models/users";
import { TasksModel } from "../models/tasks";

const SaveUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
});

const UpdateUserSchema = SaveUserSchema.partial();

export class UsersController {
  static index: Handler = async (req, res, next) => {
    try {
      const data = await UsersModel.find();

      const usersWithPassword = data.map((user) => {
        const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = user;
        return { _id, name, email, role, isWithGoogle, isWithFacebook, tasks };
      });

      res.json(usersWithPassword);
    } catch (error) {
      next(error);
    }
  };

  static show: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await UsersModel.findById(id);
      if (!user) throw new HttpError(404, "User not found!");

      const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = user;

      res.json({ _id, name, email, role, isWithGoogle, isWithFacebook, tasks });
    } catch (error) {
      next(error);
    }
  };

  static save: Handler = async (req, res, next) => {
    try {
      const body = SaveUserSchema.parse(req.body);

      // verify if user already exists in database
      const userExists = await UsersModel.findByEmail(body.email);
      if (userExists) throw new HttpError(403, "User email address already exists!");

      //encrypt password
      body.password = await bcrypt.hash(body.password, 10);

      const newUser = await UsersModel.create(body);

      const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } = newUser;

      res.status(201).json({
        message: "User created successfuly!",
        data: _id,
        name,
        email,
        role,
        isWithGoogle,
        isWithFacebook,
        tasks,
      });
    } catch (error) {
      next(error);
    }
  };

  static update: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const body = UpdateUserSchema.parse(req.body);

      // verify is user id is valid
      const user = await UsersModel.findById(id);
      if (!user) throw new HttpError(404, "User not found!");

      // verify if user already exists in database
      const userExists = await UsersModel.findByEmail(body.email as string);
      if (userExists) throw new HttpError(403, "User email address already exists!");

      // if password field exists then encrypt password
      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      //   update user
      const userUpdated = await UsersModel.updateById(id, body);

      const { _id, name, email, role, isWithGoogle, isWithFacebook, tasks } =
        userUpdated as IUserPopulated;

      res.json({
        message: "User updated successfuly!",
        data: { _id, name, email, role, isWithGoogle, isWithFacebook, tasks },
      });
    } catch (error) {
      next(error);
    }
  };

  static delete: Handler = async (req, res, next) => {
    try {
      const id = req.params.id;

      // verify is user id is valid
      const user = await UsersModel.findById(id);
      if (!user) throw new HttpError(404, "User not found!");

      // delete user
      await UsersModel.deleteById(id);
      // delete all tasks in task's collection
      await TasksModel.deleteAllTasksFromUserById(id);

      res.json({ message: "User deleted successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
