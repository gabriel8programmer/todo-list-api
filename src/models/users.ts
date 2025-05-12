import { Types } from "mongoose";
import { ITask, TasksModel } from "./tasks";
import { User } from "./schemas";

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string | null;
  role?: "ADMIN" | "CLIENT";
  isWithGoogle?: boolean;
  isWithFacebook?: boolean;
  tasks?: Types.ObjectId[];
}

export interface IUserPopulated extends Omit<IUser, "tasks"> {
  tasks?: Omit<ITask, "user">[];
}

export class UsersModel {
  static find = async (): Promise<IUserPopulated[]> => {
    const users = await User.find({}).populate("tasks").lean();
    return users as IUserPopulated[] | any[];
  };

  static findById = async (id: string): Promise<IUserPopulated | null> => {
    const user = await User.findById(id).populate("tasks").lean();
    return user as IUserPopulated | null;
  };

  static findByEmail = async (email: string): Promise<IUserPopulated | null> => {
    const user = await User.findOne({ email }).populate("tasks").lean();
    return user as IUserPopulated | null;
  };

  static create = async (params: Omit<IUser, "tasks" | "_id">): Promise<IUser> => {
    const newUser = await new User(params).save();
    return newUser.toObject() as IUser | any;
  };

  static updateById = async (
    id: string,
    params: Partial<Omit<IUser, "_id" | "tasks">>
  ): Promise<IUserPopulated | null> => {
    return User.findByIdAndUpdate(id, params, { new: true }).lean() as IUserPopulated | null | any;
  };

  static updatePasswordByEmail = async (email: string, password: string): Promise<void> => {
    await User.findOneAndUpdate({ email }, { password }, { new: true }).lean();
  };

  static deleteById = async (id: string): Promise<void> => {
    await User.findByIdAndDelete(id);
  };

  static updateTasksFromUser = async (id: string): Promise<void> => {
    const tasks = await TasksModel.findByUserId(id);
    const taskIds = tasks.map(({ _id }) => _id) as Types.ObjectId[];
    await User.findByIdAndUpdate(id, { tasks: taskIds });
  };

  static deleteTaskFromUser = async (id: string, taskId: string): Promise<void> => {
    const tasks = await TasksModel.findByUserId(id);

    const taskIdsRemaining = tasks
      .filter((task) => {
        if (task._id?.toString() !== taskId) return task;
      })
      .map(({ _id }) => _id) as Types.ObjectId[];

    await User.findByIdAndUpdate(id, { tasks: taskIdsRemaining });
  };
}
