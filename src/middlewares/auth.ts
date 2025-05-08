import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import jwt from "jsonwebtoken";
import { User } from "../models/schemas";
import { hh } from "mongoose";

export const verifyToken: Handler = async (req, res, next) => {
  try {
    const completedToken = req.headers.authorization;
    if (!completedToken?.startsWith("Bearer")) throw new HttpError(400, "Invalid bearer token!");

    const token = completedToken.split(" ")[1];
    if (!token) throw new HttpError(400, "Invalid token!");

    // get payload
    const jwtKey = process.env.JWT_SECRET_KEY || "jwt_super_secret_key";
    const payload = jwt.verify(token, jwtKey);

    if (typeof payload !== "string" && payload?.email) {
      const user = await User.findOne({ email: payload.email });
      if (!user) throw new HttpError(401, "Unauthorized!");

      const { _id, email, role } = user;
      req.user = { email, role };
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin: Handler = (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "ADMIN") {
      throw new HttpError(401, "Required ADMIN previlegies for performs this operation!");
    }

    next();
  } catch (error) {
    next(error);
  }
};
