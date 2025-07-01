import { z } from 'zod'

export const SaveTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['todo', 'doing', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
})

export const UpdateTaskSchema = SaveTaskSchema.partial()
