import { z } from 'zod'

// zod schemas
export const RegisterBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const VerifyBodySchema = z.object({
  email: z.string().email(),
  verificationCode: z.string(),
})

export const SocialBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  isWithGoogle: z.boolean().optional(),
  isWithFacebook: z.boolean().optional(),
})

export const ResetPasswordBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
