import { z } from 'zod'

// zod schemas
export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const SocialSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  isWithGoogle: z.boolean().optional(),
  isWithFacebook: z.boolean().optional(),
})

export const RecoverPassword = z.object({
  email: z.string().email(),
  password: z.string(),
})
