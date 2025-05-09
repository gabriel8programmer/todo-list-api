import { Types } from "mongoose";
import { ITask } from "./tasks";
import { Task, User } from "./schemas";

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

  static create = async (params: Omit<IUser, "tasks">): Promise<IUser> => {
    const newUser = await new User(params).save();
    return newUser.toObject() as IUser | any;
  };

  static updateById = async (
    id: string,
    params: Partial<IUser>
  ): Promise<IUserPopulated | null> => {
    return User.findByIdAndUpdate(id, params, { new: true }).lean() as IUserPopulated | null | any;
  };

  static updatePasswordByEmail = async (email: string, password: string): Promise<void> => {
    await User.findOneAndUpdate({ email }, { password }, { new: true });
  };

  static deleteById = async (id: string): Promise<void> => {
    await User.findByIdAndDelete(id);
  };

  static findTasks = async (id: string): Promise<ITask[]> => {
    const tasks = await Task.find({ user: id });
    return tasks as ITask[] | any[];
  };

  static findTaskById = async (id: string, taskId: string): Promise<ITask | null> => {
    const task = await Task.find({ user: id, _id: taskId });
    return task as ITask | null | any;
  };

  private static updateTasksFromUser = async (id: string): Promise<void> => {
    const tasks = await UsersModel.findTasks(id);
    const taskIds = tasks.map(({ _id }) => _id) as Types.ObjectId[];
    await UsersModel.updateById(id, { tasks: taskIds });
  };

  private static deleteTaskFromUser = async (id: string, taskId: string): Promise<void> => {
    const tasks = await UsersModel.findTasks(id);

    const tasksRemaining = tasks.filter(({ _id }) => {
      if (_id?.toString() !== taskId) return _id;
    });

    const taskIds = tasksRemaining.map(({ _id }) => _id) as Types.ObjectId[];

    await UsersModel.updateById(id, { tasks: taskIds });
  };

  static createTask = async (id: string, params: Omit<ITask, "user">): Promise<ITask> => {
    const newTask = await new Task({ ...params, user: id }).save();
    const plainTask = newTask.toObject();
    const userId = plainTask.user.prototype?._id as Types.ObjectId;

    // update user
    await UsersModel.updateTasksFromUser(id);

    return { ...plainTask, user: userId };
  };

  static updateTaskById = async (
    id: string,
    taskId: string,
    params: Partial<Omit<ITask, "user">>
  ): Promise<ITask | null> => {
    const updatedTask = await Task.findOneAndUpdate({ user: id, _id: taskId }, params, {
      new: true,
    }).lean();
    return updatedTask as ITask | null;
  };

  static deleteTaskById = async (id: string, taskId: string): Promise<void> => {
    await Task.findOneAndDelete({ user: id, _id: taskId });
    // update user
    await UsersModel.deleteTaskFromUser(id, taskId);
  };
}
