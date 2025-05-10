import { Handler } from "express";
import { HttpError } from "../errors/HttpError";
import { UsersModel } from "../models/users";

export const validateUserByTask: Handler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const email = req.user?.email as string;

    const user = await UsersModel.findByEmail(email);
    if (!user) throw new HttpError(404, "User not found!");

    if (user._id && user._id.toString() !== id && user.role !== "ADMIN") {
      throw new HttpError(401, "Not authorized. Only admins can perform this operation.");
    }

    next();
  } catch (error) {
    next(error);
  }
};
