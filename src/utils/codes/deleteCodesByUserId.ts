import { Code } from '../../mongoose/schema'

export const deleteCodesByUserId = async (userId: string) => {
  await Code.deleteMany({ userId })
}
