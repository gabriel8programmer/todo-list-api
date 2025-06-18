import { createTransport } from 'nodemailer'
import { EnvSchema } from '../schemas/env'

const { NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS } = EnvSchema.parse(
  process.env,
)

const emailTransporter = createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
})

export interface IEmailOptions {
  from: string
  to: string
  subject: string
  text: string
  html: string
}

export const sendEmail = async (emailOptions: IEmailOptions) => {
  try {
    await emailTransporter.sendMail(emailOptions)
  } catch (error) {
    throw new Error('Error sending email!')
  }
}
