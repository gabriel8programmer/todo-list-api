import { Types } from "mongoose";

export interface TaskParams {
  title: string;
  description?: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "midium" | "high";
  userId?: Types.ObjectId;
  _id?: Types.ObjectId;
}

export class TasksModel {}
