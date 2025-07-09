import request, { Response } from 'supertest'
import { app } from '../../app'
import { IUser } from '../../repositories'

export interface IBaseResponse {
  body: {
    message: string
    [key: string]: unknown
  }
  status: number
}

export interface IUserWithOutPassword extends Omit<IUser, 'password'> {}

export interface IRegisterCustomResponse extends IBaseResponse {
  body: {
    user: IUserWithOutPassword
    message: string
  }
}

export interface ILoginCustomResponse extends IBaseResponse {
  body: {
    message: string
    user?: IUserWithOutPassword
    accessToken?: string
    refreshToken?: string
    requiresEmailVerification?: boolean
  }
}

const formatResponse = (res: Response) => {
  const { status, body } = res
  return { status, body }
}

export const registerUserWithEmailAndPassword = async (params: {
  name: string
  email: string
  password: string
}): Promise<IRegisterCustomResponse> => {
  const res = await request(app).post('/api/auth/register').send(params)
  return formatResponse(res)
}

export const loginWithEmailAndPassword = async (params: {
  email: string
  password: string
}): Promise<ILoginCustomResponse> => {
  const res = await request(app).post('/api/auth/login').send(params)
  return formatResponse(res)
}

export const verifyEmailWithEmailAndCode = async (params: {
  email: string
  verificationCode: string
}) => {
  const res = await request(app).post('/api/auth/verify-email').send(params)
  return formatResponse(res)
}
