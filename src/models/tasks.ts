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
  user?: IUser;
}

export class TasksModel {
  static find = async (): Promise<ITask[]> => {
    const tasks = await Task.find({});
    return tasks as ITask[] | any[];
  };

  static findById = async (id: string): Promise<ITaskPopulated | ITask | null> => {
    const task = await Task.findById(id).populate("user").lean();
    return task as ITaskPopulated | null;
  };

  static create = async (params: ITask): Promise<ITask> => {
    const newTask = await new Task(params).save();
    const plainTask = newTask.toObject();
    const user = plainTask.user?.prototype?._id as Types.ObjectId;
    return { ...plainTask, user };
  };

  static updateById = async (
    id: string,
    params: Partial<Omit<ITask, "user">>
  ): Promise<ITask | null> => {
    const updatedTask = await Task.findByIdAndUpdate(id, params, {
      new: true,
    }).lean();
    return updatedTask as ITask | null;
  };

  static deleteById = async (id: string): Promise<void> => {
    await Task.findByIdAndDelete(id);
  };
}
