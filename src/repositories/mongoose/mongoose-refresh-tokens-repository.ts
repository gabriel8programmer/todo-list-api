import { RefreshToken } from '../../mongoose/schema'
import {
  ICreateRefreshTokenParams,
  IRefreshToken,
  IRefreshTokensRepository,
} from '../refresh-tokens-repository'

export class MongooseRefreshTokensRepository implements IRefreshTokensRepository {
  async findByUserId(userId: string): Promise<IRefreshToken[]> {
    return await RefreshToken.find({ userId }).lean()
  }

  async findByToken(token: string): Promise<IRefreshToken | null> {
    return await RefreshToken.findOne({ token }).lean()
  }

  async create(params: ICreateRefreshTokenParams): Promise<IRefreshToken> {
    return (await RefreshToken.create(params)).toObject()
  }

  async revokeByToken(token: string): Promise<IRefreshToken | null> {
    return await RefreshToken.findOneAndDelete({ token }).lean()
  }

  async revokeAllByUserId(userId: string): Promise<number> {
    return (await RefreshToken.deleteMany({ userId })).deletedCount
  }
}
