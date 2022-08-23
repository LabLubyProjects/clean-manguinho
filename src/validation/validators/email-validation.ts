import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { Validation } from '@/presentation/protocols'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator
  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) return new InvalidParamError(this.fieldName)
    return null
  }
}
