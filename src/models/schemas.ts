import mongoose, { Types } from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["todo", "doing", "done"],
    default: "todo",
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
    required: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "Users",
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ["ADMIN", "CLIENT"],
    default: "CLIENT",
    required: true,
  },
  isWithGoogle: {
    type: Boolean,
    default: false,
  },
  isWithFacebook: {
    type: Boolean,
    default: false,
  },
  tasks: [
    {
      type: Types.ObjectId,
      ref: "Tasks",
    },
  ],
});

const User = mongoose.model("Users", userSchema);
const Task = mongoose.model("Tasks", taskSchema);

export { User, Task };
