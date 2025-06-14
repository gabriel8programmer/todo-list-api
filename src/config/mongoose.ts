import mongoose from 'mongoose'
import 'dotenv/config'
import { z } from 'zod'

// transform enviroments variables
const envSchema = z.object({
  MONGODB_DATABASE: z.string().optional(),
  MONGODB_USER: z.string().optional(),
  MONGODB_PASSWORD: z.string().optional(),
  MONGODB_URL: z.string().optional(),
})

const _env = envSchema.parse(process.env)

let mongodbUrl: string

if (_env.MONGODB_PASSWORD && _env.MONGODB_USER) {
  const { MONGODB_PASSWORD: PASS, MONGODB_USER: USER, MONGODB_DATABASE: DATABASE } = _env
  mongodbUrl = `mongodb://${USER}:${PASS}@localhost:27017/${DATABASE}`
} else if (_env.MONGODB_URL) {
  mongodbUrl = _env.MONGODB_URL
} else {
  mongodbUrl = `mongodb://localhost:27017/${_env.MONGODB_DATABASE}`
}

console.log(mongodbUrl)

mongoose
  .connect(mongodbUrl)
  .then(() => console.log('✅ Connection to mongodb successful!'))
  .catch(err => console.error('❌ Error on connect with mongoDB:', err))
