import { Code } from '../../mongoose/schema'
import { ICode, ICodesRepository, ICreateCodeParams } from '../codes-repository'

export class MongooseCodesRepository implements ICodesRepository {
  private formatCodeForResponse(user: any): ICode {
    const { _id: _, ...rest } = user
    return rest
  }

  async findByUserId(userId: string): Promise<ICode[] | null> {
    const codes = await Code.find({ userId }).lean()
    return codes.map(code => this.formatCodeForResponse(code))
  }

  async create(params: ICreateCodeParams): Promise<ICode> {
    const newCode = await Code.create(params)
    return this.formatCodeForResponse(newCode.toObject())
  }

  async deleteByUserId(userId: string): Promise<void> {
    await Code.deleteMany({ userId })
  }
}
