import { z } from 'zod'
import { SaveTaskRequestBodySchema } from './task-schemas'

export const SaveUserRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['ADMIN', 'CLIENT']).default('CLIENT'),
  emailVerified: z.boolean().default(false),
})

export const UpdateUserRequestBodySchema = SaveUserRequestBodySchema.partial()

export const AddTaskRequestBodySchema = SaveTaskRequestBodySchema.omit({ user: true })
export const UpdateTaskRequestBodySchema = AddTaskRequestBodySchema.partial()
