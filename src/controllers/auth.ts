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
      const userExists = await User.findOne({ email: body.email });
      if (userExists) throw new HttpError(403, "User email address already exists!");

      // crypted password
      body.password = await bcrypt.hash(body.password, 10);

      // create user
      const user = new User(body);
      await user.save();

      res.status(201).json({ message: "User regitered with successfuly!", user });
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

  static social: Handler = async (req, res, next): Promise<void | any> => {
    try {
      const body = SocialSchema.parse(req.user);
      const user = await User.findOne({ email: body.email });

      // create user
      if (!user) {
        const newUser = new User(body);
        await newUser.save();

        // create access token jwt
        const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
        const { _id, name, email, role } = newUser;
        const accessToken = await jwt.sign({ id: _id, name, email }, jwtKey, { expiresIn: "1d" });
        // returning user and accesstoken
        return res.json({
          message: "User created successfuly!",
          user: {
            id: _id,
            name,
            email,
            role,
          },
          accessToken,
        });
      }

      // create access token jwt
      const jwtKey = process.env.JWT_SECRET_KEY || "JWT_SUPER_SECRET_KEY";
      const { _id, name, email, role } = user;
      const accessToken = await jwt.sign({ id: _id, name, email }, jwtKey, { expiresIn: "1d" });

      res.json({
        message: "Logged successfuly!",
        user: { id: _id, name, email, role },
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
      const user = await User.findOne({ email });
      if (!user) throw new HttpError(404, "User not found!");

      if (user.isWithFacebook || user.isWithGoogle) {
        throw new HttpError(400, "User already autheticated with social method!");
      }

      // encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);
      // recover password
      await User.updateOne({ email }, { password: encryptedPassword });

      res.json({ message: "Password recovered successfuly!" });
    } catch (error) {
      next(error);
    }
  };
}
