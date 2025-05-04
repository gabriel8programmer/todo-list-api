import { Handler } from "express";
import { z } from "zod";
import { User } from "../models/schemas";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// zod schemas
const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["ADMIN", "CLIENT"]).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  static register: Handler = async (req, res, next) => {
    try {
      const body = RegisterSchema.parse(req.body);
      // crypted password
      body.password = await bcrypt.hash(body.password, 10);

      // create user
      const user = new User(body);
      await user.save();

      // send verification email

      res.json({ message: "User regitered with successfuly!", user });
    } catch (error) {
      next(error);
    }
  };

  static login: Handler = async (req, res, next) => {
    try {
      const { email, password } = LoginSchema.parse(req.body);

      // validate user and password
      const user = await User.findOne({ email });
      const passwordPassed = await bcrypt.compare(password, user?.password as string);
      if (!user || !passwordPassed) throw new HttpError(401, "Invalid Credentials!");

      // create access token jwt
      const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
      const { id, name, email: UserEmail, role } = user;
      const accessToken = await jwt.sign({ id, email: UserEmail }, jwtKey, { expiresIn: "1d" });

      res.json({
        message: "Logged successfuly!",
        user: { id, name, email: UserEmail, role },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  static social: Handler = async (req, res, next) => {
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
