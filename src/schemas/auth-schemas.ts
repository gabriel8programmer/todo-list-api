import { z } from 'zod'

// zod schemas
export const RegisterRequestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(1),
})

export const LoginRequestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const LogoutRequestBodySchema = z.object({
  email: z.string().email(),
})

export const RefreshRequestBodySchema = LogoutRequestBodySchema

export const VerifyRequestBodySchema = z.object({
  email: z.string().email(),
  verificationCode: z.string(),
})

export const ForgotRequestBodySchema = z.object({
  email: z.string().email(),
})

export const ResetRequestBodySchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(1),
  verificationCode: z.string(),
})

export const SocialRequestUserSchema = z.object({
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
