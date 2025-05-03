import { Handler } from "express";
import { z } from "zod";
import { User } from "../models/schemas";
import bcrypt from "bcrypt";

// zod schemas
const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
});

export class AuthController {
  static register: Handler = async (req, res, next) => {
    try {
      const body = RegisterSchema.parse(req.body);

      if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
      }

      const user = new User(body);
      await user.save();

      res.json({ message: "User regitered with successfuly!", user });
    } catch (error) {
      next(error);
    }
  };

  static login: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  static google: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  static forgotPassword: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  static recoverPassword: Handler = async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  };
}
