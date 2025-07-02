import { HttpError } from '../errors/http-error'
import {
  ICreateRefreshTokenParams,
  IRefreshTokensRepository,
} from '../repositories/refresh-tokens-repository'

export class RefreshTokenServices {
  constructor(private readonly refreshTokensRepository: IRefreshTokensRepository) {}

  async getToken(token: string) {
    const ftoken = await this.refreshTokensRepository.findByToken(token)
    if (ftoken) throw new HttpError(404, 'Refresh token not found!')
    return ftoken
  }

  async getTokensByUserId(userId: string) {
    return await this.refreshTokensRepository.findByUserId(userId)
  }

  async createToken(params: ICreateRefreshTokenParams) {
    return await this.refreshTokensRepository.create(params)
  }

  async deleteToken(token: string) {
    return this.refreshTokensRepository.deleteByToken(token)
  }

  async deleteTokensByUserId(userId: string) {
    return this.refreshTokensRepository.deleteAllByUserId(userId)
  }
}
