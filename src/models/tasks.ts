import { Types } from "mongoose";
import { Task } from "./schemas";
import { IUser } from "./users";

export interface ITask {
  _id?: Types.ObjectId;
  title: string;
  description?: string | null;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  user: Types.ObjectId | string;
}

export interface ITaskPopulated extends Omit<ITask, "user"> {
  user?: Omit<IUser, "tasks" | "_id">;
}

export class TasksModel {
  static find = async (): Promise<ITask[]> => {
    const tasks = await Task.find({}).lean();
    return tasks as ITask[] | any;
  };

  static findById = async (id: string): Promise<ITaskPopulated | null> => {
    const task = await Task.findById(id).populate("user").lean();
    return task as ITaskPopulated | null;
  };

  static findByUserId = async (userId: string): Promise<ITask[]> => {
    const tasks = await Task.find({ user: userId }).lean();
    return tasks as ITask[] | any;
  };

  static findByUserIdAndTaskId = async (
    userId: string,
    taskId: string
  ): Promise<ITaskPopulated | null> => {
    const task = await Task.findOne({ user: userId, _id: taskId }).populate("user").lean();
    return task as ITaskPopulated | null;
  };

  static create = async (params: Omit<ITask, "_id">): Promise<ITask> => {
    const newTask = await new Task(params).save();
    const plainTask = newTask.toObject();
    const user = plainTask.user?.prototype?._id as Types.ObjectId;
    return { ...plainTask, user };
  };

  static updateById = async (
    id: string,
    params: Partial<Omit<ITask, "user" | "_id">>
  ): Promise<ITask | null> => {
    const updatedTask = await Task.findByIdAndUpdate(id, params, {
      new: true,
    }).lean();
    return updatedTask as ITask | null;
  };

  static updateByUserIdAndTaskId = async (
    userId: string,
    taskId: string,
    params: Partial<Omit<ITask, "user" | "_id">>
  ): Promise<ITask | null> => {
    const udpatedTask = await Task.findOneAndUpdate({ user: userId, _id: taskId }, params, {
      new: true,
    }).lean();
    return udpatedTask as ITask | null;
  };

  static deleteByUserIdAndTaskId = async (userId: string, taskId: string): Promise<void> => {
    await Task.findOneAndDelete({ user: userId, _id: taskId });
  };

  static deleteById = async (id: string): Promise<void> => {
    await Task.findByIdAndDelete(id);
  };

  static deleteAllTasksFromUserById = async (id: string): Promise<void> => {
    await Task.deleteMany({ user: id });
  };
}
