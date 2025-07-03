import { z } from 'zod'

export const SaveUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['ADMIN', 'CLIENT']).default('CLIENT'),
  emailVerified: z.boolean().default(false),
})

export const UpdateUserSchema = SaveUserSchema.partial()
