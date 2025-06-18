import fs from 'fs'
import { resolve } from 'node:path'
import { IEmailOptions, sendEmail } from '../../config/nodemailer'
import { EnvSchema } from '../../schemas/env'

const emailTemplatePath = resolve('src', 'templates', 'emails', 'verify-email.html')
const verifyEmailFileHtml = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })

const _from_env_user = EnvSchema.parse(process.env).NODEMAILER_USER

export const sendEmailWithVerificationCode = async (to: string, code: string) => {
  const html = verifyEmailFileHtml.replace('{{CODE}}', code)

  const emailOptions: IEmailOptions = {
    from: _from_env_user as string,
    to,
    subject: 'Verificação de email',
    html,
  }

  await sendEmail(emailOptions)
}
