// tests/mocks/FakeEmailServices.ts

import { EmailServices } from '../../services/EmailServices'

export class FakeEmailServices extends EmailServices {
  async sendEmailWithVerificationCode() {
    return
  }
}
