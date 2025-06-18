import bcrypt from 'bcrypt'

export const encryptPassword = async (
  password: string,
  saltRounds: number = 10,
): Promise<string> => {
  return await bcrypt.hash(password, saltRounds)
}
