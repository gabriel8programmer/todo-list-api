import { connect } from '../../config/mongoose'
import { User } from '../schema'

connect().catch(error => console.log(error))

User.create({
  name: 'admin',
  email: 'admin@gmail.com',
  password: '123',
  emailVerified: true,
  role: 'ADMIN',
})
  .then(() => console.log('Experimental admin created!'))
  .catch(error => console.log(error))
