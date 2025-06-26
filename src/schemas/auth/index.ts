import { z } from 'zod'

// zod schemas
export const RegisterBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
})

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const VerifyBodySchema = z.object({
  email: z.string().email(),
  verificationCode: z.string(),
})

export const ForgotBodySchema = z.object({
  email: z.string().email(),
})

export const ResetBodySchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(1),
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
  password: z.string().min(1),
})
