import { ICodesRepository } from '../repositories/codes-repository'

export class CodeServices {
  constructor(private readonly codesRepository: ICodesRepository) {}

  getRandomCodeWithLength(length: number) {
    return String(Math.floor(Math.random() * 10 ** length)).padStart(length, '0')
  }

  async findCodeByUserId(userId: string) {
    return this.codesRepository.findByUserId(userId)
  }

  async create(params: { code: string; userId: string }) {
    return this.codesRepository.create(params)
  }

  async deleteAllCodesByUserId(userId: string) {
    await this.codesRepository.deleteByUserId(userId)
  }
}
