import { Handler } from "express";
import { z } from "zod";
import { HttpError } from "../errors/HttpError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersModel } from "../models/users";

// zod schemas
const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const SocialSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  isWithGoogle: z.boolean().optional(),
  isWithFacebook: z.boolean().optional(),
});

const RecoverPassword = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  static register: Handler = async (req, res, next) => {
    try {
      const body = RegisterSchema.parse(req.body);
      // verify if user already exists in database
      const userExists = await UsersModel.findByEmail(body.email);
      if (userExists) throw new HttpError(403, "User email address already exists!");

      // crypted password
      body.password = await bcrypt.hash(body.password, 10);

      // create user
      const user = await UsersModel.create(body);
      const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;

      res.status(201).json({
        message: "User regitered with successfuly!",
        data: { _id, name, email, role, isWithGoogle, isWithFacebook },
      });
    } catch (error) {
      next(error);
    }
  };

  static login: Handler = async (req, res, next) => {
    try {
      const { email: userEmail, password } = LoginSchema.parse(req.body);

      // validate user and password
      const user = await UsersModel.findByEmail(userEmail);
      const passwordPassed = await bcrypt.compare(password, user?.password as string);
      if (!user || !passwordPassed) throw new HttpError(401, "Invalid Credentials!");

      // create access token jwt
      const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
      const accessToken = await jwt.sign({ email: user.email }, jwtKey, { expiresIn: "1d" });

      const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;

      res.json({
        message: "Logged successfuly!",
        data: { _id, name, email, role, isWithFacebook, isWithGoogle },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  static social: Handler = async (req, res, next): Promise<void | any> => {
    try {
      const body = SocialSchema.parse(req.user);
      const user = await UsersModel.findByEmail(body.email);

      // create user
      if (!user) {
        const newUser = await UsersModel.create(body);

        // create access token jwt
        const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
        const accessToken = await jwt.sign({ email: newUser.email }, jwtKey, { expiresIn: "1d" });

        const { _id, name, email, role, isWithFacebook, isWithGoogle } = newUser;

        // returning user and accesstoken
        return res.status(201).json({
          message: "User regitered with successfuly!",
          data: { _id, name, email, role, isWithFacebook, isWithGoogle },
          accessToken,
        });
      }

      // create access token jwt
      const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
      const accessToken = await jwt.sign({ email: user.email }, jwtKey, { expiresIn: "1d" });

      const { _id, name, email, role, isWithFacebook, isWithGoogle } = user;

      res.json({
        message: "Logged successfuly!",
        data: { _id, name, email, role, isWithFacebook, isWithGoogle },
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  static recoverPassword: Handler = async (req, res, next) => {
    try {
      const { email, password } = RecoverPassword.parse(req.body);
      // verify if user already exists in database
      const user = await UsersModel.findByEmail(email);
      if (!user) throw new HttpError(404, "User not found!");

      if (user.isWithFacebook || user.isWithGoogle) {
        throw new HttpError(400, "User already autheticated with social method!");
      }

      // encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);
      // recover password
      await UsersModel.updatePasswordByEmail(email, encryptedPassword);

      res.json({ message: "Password recovered successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
