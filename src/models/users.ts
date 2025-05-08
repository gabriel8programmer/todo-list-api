import { Types } from "mongoose";
import { Task, User } from "./schemas";
import { TaskParams } from "./tasks";

export interface UserParams {
  name: string;
  email: string;
  password?: string | null;
  role?: "ADMIN" | "CLIENT";
  isWithGoogle?: boolean;
  isWithFacebook?: boolean;
  tasks: Types.ObjectId[];
}

export interface UserResponse extends Omit<UserParams, "password" | "tasks"> {
  _id?: any;
  tasks: any[];
}

export interface UserWithPassword extends UserResponse {
  password?: string | null;
}

export class UsersModel {
  static find = async (): Promise<UserResponse[]> => {
    return await User.find({}).populate("tasks").lean();
  };

  static findById = async (id: string): Promise<UserResponse | null> => {
    return await User.findById(id).populate("tasks").lean();
  };

  static findByEmail = async (email: string): Promise<UserWithPassword | null> => {
    return User.findOne({ email }).populate("tasks").lean();
  };

  static create = async (params: Omit<UserParams, "tasks">): Promise<UserResponse> => {
    const newUser = new User(params);
    await newUser.save();
    return newUser;
  };

  static updateById = async (
    id: string,
    params: Partial<UserParams>
  ): Promise<UserResponse | null> => {
    return User.findByIdAndUpdate(id, params, { new: true });
  };

  static updatePasswordByEmail = async (email: string, password: string): Promise<void> => {
    await User.findOneAndUpdate({ email }, { password }, { new: true });
  };

  static deleteById = async (id: string): Promise<void> => {
    await User.findByIdAndDelete(id);
  };

  static findTasks = async (id: string) => {};

  static findTaskById = async (id: string, taskId: string) => {};

  static createTask = async (id: string, params: TaskParams) => {};

  static updateTaskById = async (id: string, taskId: string, params: Partial<TaskParams>) => {};

  static deleteTaskById = async (id: string, taskId: string) => {};
}
