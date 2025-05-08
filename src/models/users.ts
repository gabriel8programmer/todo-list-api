import { Types } from "mongoose";
import { Task, User } from "./schemas";

export interface UserParams {
  name: string;
  email: string;
  password?: string | null;
  role?: "ADMIN" | "CLIENT";
  isWithGoogle?: boolean;
  isWithFacebook?: boolean;
}

export interface UserResponse extends UserParams {
  _id?: Types.ObjectId;
  tasks: any[];
}

export class UsersModel {
  static find = async (): Promise<UserResponse[]> => {
    return User.find({}).populate("tasks");
  };

  static findById = async (id: string): Promise<UserResponse | null> => {
    const user = await User.findById(id).populate("tasks");
    return user;
  };

  static findByEmail = async (email: string): Promise<UserResponse | null> => {
    return User.findOne({ email }).populate("tasks");
  };

  static create = async (params: UserParams): Promise<UserResponse> => {
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
}
