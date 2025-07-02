export interface IRefreshToken {
  token: string
  userId: string
  createdAt: Date
  revoked?: boolean
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
  revokeByToken: (token: string) => Promise<IRefreshToken | null>
  revokeAllByUserId: (userId: string) => Promise<number>
}
