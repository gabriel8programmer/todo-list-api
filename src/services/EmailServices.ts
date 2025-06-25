import { sendEmailWithVerificationCode } from '../utils/emails/sendEmailWithVerificationCode'
import { CodeServices } from './CodeServices'

export class EmailServices {
  constructor(private codeServices: CodeServices) {}

  async sendEmailWithVerificationCode(email: string, userId: string) {
    //check if the number of codes requested by the user exceeds 3
    const codes = await this.codeServices.findCodeByUserId(userId)

    if (!codes) throw new Error('There is no code available for this user!')

    if (codes.length >= 3) throw new Error('Exceed number of the codes verification for this user!')

    //generate authentication code
    const code = await this.codeServices.getRandomCodeWithLength(4)
    //send email
    await sendEmailWithVerificationCode(email, code)
    //save code in database
    await this.codeServices.create({ code, userId })
  }
}
