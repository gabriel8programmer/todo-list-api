import 'dotenv/config'

import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

//global mocks
jest.mock('./src/config/mongoose')
jest.mock('./src/config/nodemailer')
jest.mock('./src/services/email-services')

let mongo: MongoMemoryServer

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  const uri = mongo.getUri()
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.connection.close()
  await mongo.stop()
})

afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})
