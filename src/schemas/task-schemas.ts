import { z } from 'zod'

export const SaveTaskRequestBodySchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  user: z.string(),
})

export const UpdateTaskRequestBodySchema = SaveTaskRequestBodySchema.partial()
