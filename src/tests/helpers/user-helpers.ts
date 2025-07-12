import { ICreateUserParams } from '../../repositories'
import { UserServices } from '../../services'

export const createUser = async (
  userServices: UserServices,
  params: Omit<ICreateUserParams, 'isWithGoogle' | 'isWithFacebook'>,
) => {
  return await userServices.createUser(params)
}
