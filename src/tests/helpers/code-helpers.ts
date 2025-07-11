import { CodeServices } from '../../services'

export const createFakeCodeWithUserId = async (codeServices: CodeServices, userId: string) => {
  return await codeServices.create({
    code: codeServices.getRandomCodeWithLength(4),
    userId,
  })
}
