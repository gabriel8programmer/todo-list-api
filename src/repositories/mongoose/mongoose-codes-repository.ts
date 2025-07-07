import { Code } from '../../mongoose/schema'
import { ICode, ICodesRepository, ICreateCodeParams } from '../codes-repository'

export class MongooseCodesRepository implements ICodesRepository {
  async findByUserId(userId: string): Promise<ICode[] | null> {
    return await Code.find({ userId }).lean()
  }

  async create(params: ICreateCodeParams): Promise<ICode> {
    return await Code.create(params)
  }

  async deleteByUserId(userId: string): Promise<void> {
    await Code.deleteMany({ userId })
  }
}
