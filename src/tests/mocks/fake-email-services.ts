// tests/mocks/FakeEmailServices.ts

import { EmailServices } from '../../services/email-services'

export class FakeEmailServices extends EmailServices {
  async sendEmailWithVerificationCode() {
    return
  }
}
