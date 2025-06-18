import { Code } from '../../mongoose/schema'

export const deleteCode = async (id: string) => {
  await Code.deleteOne({ id })
}
