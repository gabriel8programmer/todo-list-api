import { IUserBase } from '../../repositories/users-repository'

export interface IUserRequest
  extends Partial<
    Pick<
      IUserBase,
      'id' | 'name' | 'email' | 'role' | 'emailVerified' | 'isWithGoogle' | 'isWithFacebook'
    >
  > {}

declare global {
  namespace Express {
    interface Request {
      user?: IUserRequest
    }
  }
}
