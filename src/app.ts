import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from 'node:fs'
import path from 'node:path'

import { connect } from './config/mongoose'

// connect with database
if (process.env.NODE_ENV !== 'test') {
  connect().catch(error => console.log(error))
}

import { HandlerErrorsMiddleware } from './middlewares/handler-errors-middleware'

// routers
import { tasksRouter } from './routes/tasks'
import { adminUsersRouter } from './routes/admin-users'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'
import { adminTasksRouter } from './routes/admin-tasks'

const app = express()

// config cors and json
app.use(express.json())
app.use(cors())

// routes here
app.use('/api/admin/users', adminUsersRouter) // admin users
app.use('/api/admin/tasks', adminTasksRouter) // admin tasks
app.use('/api/auth', authRouter) // auth
app.use('/api/users', usersRouter) // users
app.use('/api/users/:id/tasks', tasksRouter) // tasks to common users

// terms of service
app.use('/terms', (req, res) => {
  res.send('Terms of service here!') // just example
})

// use swagger for API documentation
app.use('/docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  const swaggerPath = path.resolve(__dirname, '../swagger.json')
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'))
  swaggerUi.setup(swaggerDocument)(req, res, next)
})

// handler errors
app.use(HandlerErrorsMiddleware)

export { app }
