import { Code } from '../../mongoose/schema'

export const getCodesByUserId = async (userId: string) => {
  return await Code.find({ userId })
}
