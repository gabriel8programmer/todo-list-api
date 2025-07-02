import 'dotenv/config'
import mongoose from 'mongoose'
import { EnvSchema } from '../schemas/env-schemas'

const _env = EnvSchema.parse(process.env)

let mongodbUrl = _env.MONGODB_URL as string

export const connect = async () => {
  try {
    await mongoose.connect(mongodbUrl)
    console.log('✅ Connection to mongodb successfuly!')
  } catch (error: any) {
    throw new Error('❌ Error on connect with mongoDB:', error.message)
  }
}
