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

  async deleteByToken(token: string): Promise<IRefreshToken | null> {
    return await RefreshToken.findOneAndDelete({ token }, { new: true }).lean()
  }

  async deleteAllByUserId(userId: string): Promise<number> {
    return (await RefreshToken.deleteMany({ userId }, { revoked: true })).deletedCount
  }
}
