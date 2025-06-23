import { z } from 'zod'

export const EnvSchema = z
  .object({
    PORT: z.coerce.number(),
    NODEMAILER_PORT: z.coerce.number(),
    MONGODB_URL: z.string(),
    MONGODB_TEST_URL: z.string(),
    EXPERIMENTAL_ADMIN_PASS: z.string(),
    JWT_SECRET_KEY: z.string(),
    GOOGLE_AUDIENCE: z.string(),
    NODEMAILER_HOST: z.string(),
    NODEMAILER_USER: z.string(),
    NODEMAILER_PASS: z.string(),
  })
  .partial()
