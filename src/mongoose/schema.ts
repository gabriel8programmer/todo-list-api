import mongoose from 'mongoose'
import { ITask } from '../repositories/TasksRepository'
import { v4 as uuidv4 } from 'uuid'
import { IUser } from '../repositories/UsersRepository'

export const TaskSchema = new mongoose.Schema<ITask>({
  id: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo',
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
    required: true,
  },
  user: {
    type: String,
    ref: 'Users',
    required: true,
  },
})

export const UserSchema = new mongoose.Schema<IUser>({
  id: {
    type: String,
    required: true,
    default: () => uuidv4(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CLIENT'],
    default: 'CLIENT',
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
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
      type: String,
      ref: 'Tasks',
    },
  ],
})

export const User = mongoose.model('Users', UserSchema)
export const Task = mongoose.model('Tasks', TaskSchema)
