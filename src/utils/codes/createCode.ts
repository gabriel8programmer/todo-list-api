import { Code } from '../../mongoose/schema'
import { genRandomCode } from './genRandomCode'

export const createRandomCode = async (id: string) => {
  const randomCode = genRandomCode(4)
  await Code.create({ userId: id, code: randomCode })
}
