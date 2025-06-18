import bcrypt from 'bcrypt'

export const verifyPassword = async (
  password: string,
  encryptedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, encryptedPassword)
}
