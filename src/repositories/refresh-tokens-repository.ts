export interface IRefreshToken {
  _id: string
  token: string
  userId: string
  createdAt: Date
  userAgent?: string
  ip?: string
}

export interface ICreateRefreshTokenParams {
  token: string
  userId: string
  userAgent?: string
  ip?: string
}

export interface IRefreshTokensRepository {
  findByUserId: (userId: string) => Promise<IRefreshToken[]>
  findByToken: (token: string) => Promise<IRefreshToken | null>
  create: (params: ICreateRefreshTokenParams) => Promise<IRefreshToken>
  deleteByToken: (token: string) => Promise<IRefreshToken | null>
  deleteAllByUserId: (userId: string) => Promise<number>
}
