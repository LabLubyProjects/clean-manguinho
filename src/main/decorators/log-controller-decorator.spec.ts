import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { mockLogErrorRepository } from '@/data/test'
import { mockAccountModel } from '@/domain/test'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

describe('LogController Decorator', () => {
  const mockRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  })

  const mockServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return serverError(fakeError)
  }

  interface SutType {
    sut: LogControllerDecorator
    logErrorRepositoryStub: LogErrorRepository
    controllerStub: Controller
  }

  const makeSut = (): SutType => {
    const controllerStub = makeController()
    const logErrorRepositoryStub = mockLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
    return {
      sut, logErrorRepositoryStub, controllerStub
    }
  }

  const makeController = (): Controller => {
    class ControllerStub implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse = ok(mockAccountModel())
        return httpResponse
      }
    }
    return new ControllerStub()
  }

  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(mockRequest())
    expect(handleSpy).toHaveBeenCalledWith(mockRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise((resolve, reject) => resolve(mockServerError())))
    await sut.handle(mockRequest())
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
