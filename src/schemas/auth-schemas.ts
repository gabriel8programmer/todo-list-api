import { z } from 'zod'

// zod schemas
export const RegisterBodyRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
})

export const LoginBodyRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const LogoutBodyRequestSchema = z.object({
  email: z.string().email(),
})

export const VerifyBodyRequestSchema = z.object({
  email: z.string().email(),
  verificationCode: z.string(),
})

export const ForgotBodyRequestSchema = z.object({
  email: z.string().email(),
})

export const ResetBodyRequestSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(1),
  verificationCode: z.string(),
})

export const SocialUserRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean().default(false),
  isWithGoogle: z.boolean().default(false),
  isWithFacebook: z.boolean().default(false),
})

export const ResetPasswordBodyRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
