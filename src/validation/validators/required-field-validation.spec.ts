import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required Field Validation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field')
  }

  test('Should return a MissingParamError ir validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return null if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeNull()
  })
})
