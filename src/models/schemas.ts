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
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  userId: {
    type: Types.ObjectId,
    ref: "Users",
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
  },
  isWithGoogle: {
    type: Boolean,
    default: false,
  },
  isWithFacebook: {
    type: Boolean,
    default: false,
  },
  // list tasks
  tasks: [taskSchema],
});

const User = mongoose.model("Users", userSchema);
const Task = mongoose.model("Tasks", taskSchema);

export { User, Task };
