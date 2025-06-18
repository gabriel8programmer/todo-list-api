import { Code } from '../../mongoose/schema'

export const createRandomCodeWithUserId = async (code: string, userId: string) => {
  await Code.create({ userId, code })
}
