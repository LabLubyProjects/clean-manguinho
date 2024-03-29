import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'
import { mockValidation } from '../test/mock-validation'
import { ValidationComposite } from './validation-composite'

describe('Validation Composite', () => {
  interface SutTypes {
    sut: ValidationComposite
    validationStubs: Validation[]
  }

  const makeSut = (): SutTypes => {
    const validationStubs = [mockValidation(), mockValidation()]
    const sut = new ValidationComposite(validationStubs)
    return { sut, validationStubs }
  }

  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

  test('Should return null if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toBeNull()
  })
})
