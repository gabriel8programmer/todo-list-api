import fs from 'fs'
import { resolve } from 'node:path'
import { IEmailOptions, sendEmail } from '../../config/nodemailer'

const emailTemplatePath = resolve('..', '..', 'templates', 'emails', 'verify-email.html')
const verifyEmailFileHtml = fs.readFileSync(emailTemplatePath, { encoding: 'utf-8' })

export const sendEmailWithCode = async (from: string, to: string, code: string) => {
  const html = verifyEmailFileHtml.replace('{{CODE}}', code)

  const emailOptions: IEmailOptions = {
    from,
    to,
    subject: 'Verificação de email',
    html,
  }

  await sendEmail(emailOptions)
}
