import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import fs from 'node:fs'
import path from 'node:path'

// connect with database
if (process.env.NODE_ENV !== 'test') {
  import('./config/mongoose')
}

import { HandlerErrorsMiddleware } from './middlewares/handlerErrorsMiddleware'

// routers
import { tasksRouter } from './routes/tasks'
import { adminRouter } from './routes/admin'
import { authRouter } from './routes/auth'
import { usersRouter } from './routes/users'

const app = express()

// config cors and json
app.use(express.json())
app.use(cors())

// routes here
app.use('/api/admin', adminRouter) // admin
app.use('/api/auth', authRouter) // auth
app.use('/api/users', usersRouter) // users
app.use('/api/users/:id/tasks', tasksRouter) // tasks from users

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
