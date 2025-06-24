import { HttpError } from '../errors/HttpError'
import { IUsersRepository } from '../repositories/UsersRepository'
import { createRandomCodeWithUserId } from '../utils/codes/createCodeWithUserId'
import { genRandomCodes } from '../utils/codes/genRandomCode'
import { getCodesByUserId } from '../utils/codes/getCodesByUserId'
import { sendEmailWithVerificationCode } from '../utils/emails/sendEmailWithVerificationCode'

export class EmailServices {
  async sendEmailWithVerificationCode(email: string, userId: string) {
    //check if the number of codes requested by the user exceeds 3
    const codes = await getCodesByUserId(userId)
    if (codes.length >= 3) throw new Error('Exceed number of the codes verification for this user!')

    //generate authentication code
    const code = await genRandomCodes(4)
    //send email
    await sendEmailWithVerificationCode(email, code)
    //save code in database
    await createRandomCodeWithUserId(code, userId)
  }
}
