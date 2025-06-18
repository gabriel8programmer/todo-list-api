import mongoose from 'mongoose'
import 'dotenv/config'
import { EnvSchema } from '../schemas/env'

const _env = EnvSchema.parse(process.env)

let mongodbUrl = _env.MONGODB_URL as string

mongoose
  .connect(mongodbUrl)
  .then(() => console.log('✅ Connection to mongodb successful!'))
  .catch(err => console.error('❌ Error on connect with mongoDB:', err))
