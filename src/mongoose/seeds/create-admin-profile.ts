import 'dotenv/config'

import { EnvSchema } from '../../schemas/env-schemas'
import { MongooseUsersRepository } from '../../repositories/mongoose/mongoose-users-repository'
import { encryptPassword } from '../../utils/passwords/encryptPassword'

import { connect } from '../../config/mongoose'

console.log(EnvSchema.parse(process.env).MONGODB_URL)

connect()
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.log(error)
  })
