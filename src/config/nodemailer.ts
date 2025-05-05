import { createTransport } from "nodemailer";
import { z } from "zod";

const ENV_SCHEMA = z.object({
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
});

const EmailEnv = ENV_SCHEMA.parse(process.env);

export const emailTransporter = createTransport({
  host: EmailEnv.EMAIL_HOST,
  port: EmailEnv.EMAIL_PORT,
  auth: {
    user: EmailEnv.EMAIL_USER,
    pass: EmailEnv.EMAIL_PASS,
  },
});
