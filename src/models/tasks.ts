import { Types } from "mongoose";
import { Task } from "./schemas";

export interface TaskParams {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  user: Types.ObjectId | string;
}

export class TasksModel {
  static find = async (): Promise<TaskParams[]> => {
    return Task.find({});
  };

  static findById = async (id: string): Promise<TaskParams | null> => {
    return Task.findById(id).populate("user");
  };

  static create = async (params: TaskParams): Promise<TaskParams> => {
    const newTask = new Task(params);
    await newTask.save();
    return newTask;
  };

  static updateById = async (
    id: string,
    params: Partial<TaskParams>
  ): Promise<TaskParams | null> => {
    return Task.findByIdAndUpdate(id, params, { new: true });
  };

  static deleteById = async (id: string): Promise<void> => {
    await Task.findByIdAndDelete(id);
  };
}
