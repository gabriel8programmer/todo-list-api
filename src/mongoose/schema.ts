import mongoose from 'mongoose'
import { ITask } from '../repositories/tasks-repository'
import { v4 as uuidv4 } from 'uuid'
import { IUser } from '../repositories/users-repository'
import { ICode } from '../repositories/codes-repository'
import { IRefreshToken } from '../repositories/refresh-tokens-repository'

export const TaskSchema = new mongoose.Schema<ITask>(
  {
    id: {
      type: String,
      required: true,
      default: () => uuidv4(),
      unique: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const UserSchema = new mongoose.Schema<IUser>(
  {
    id: {
      type: String,
      required: true,
      default: () => uuidv4(),
      unique: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

export const CodeSchema = new mongoose.Schema<ICode>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },
    code: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // default 10 minutes
    },
  },
  { timestamps: false, versionKey: false },
)

export const RefreshTokenSchema = new mongoose.Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userAgent: String,
    ip: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 24 * 60 * 60, //default 30 days
    },
  },
  { timestamps: false, versionKey: false },
)

export const User = mongoose.model('Users', UserSchema)
export const Task = mongoose.model('Tasks', TaskSchema)
export const Code = mongoose.model('Codes', CodeSchema)
export const RefreshToken = mongoose.model('Refresh-tokens', RefreshTokenSchema)
