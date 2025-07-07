export interface ICode {
  _id: string
  code: string
  userId: string
  createdAt: Date
}

export interface ICreateCodeParams {
  code: string
  userId: string
}

export interface ICodesRepository {
  findByUserId: (userId: string) => Promise<ICode[] | null>
  create: (params: ICreateCodeParams) => Promise<ICode>
  deleteByUserId: (userId: string) => Promise<void>
}
