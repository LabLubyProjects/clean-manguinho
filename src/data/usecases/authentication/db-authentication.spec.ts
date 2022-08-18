import { AccountModel } from '../../../domain/models/account'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparator } from '../../protocols/criptography/hash-comparator'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'

describe('DbAuthentication UseCase', () => {
  const makeFakeAccount = (): AccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password'
  })

  const makeFakeAuthentication = (): AuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password'
  })

  const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel | null> {
        const account: AccountModel = makeFakeAccount()
        return account
      }
    }
    return new LoadAccountByEmailRepositoryStub()
  }

  const makeHashComparator = (): HashComparator => {
    class HashComparatorStub implements HashComparator {
      async compare (value: string, hash: string): Promise<boolean> {
        return true
      }
    }
    return new HashComparatorStub()
  }

  const makeTokenGenerator = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
      async generate (id: string): Promise<string> {
        return 'token'
      }
    }
    return new TokenGeneratorStub()
  }

  interface SutTypes {
    sut: DbAuthentication
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
    hashComparatorStub: HashComparator
    tokenGeneratorStub: TokenGenerator
  }

  const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
    const hashComparatorStub = makeHashComparator()
    const tokenGeneratorStub = makeTokenGenerator()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparatorStub, tokenGeneratorStub)
    return { sut, loadAccountByEmailRepositoryStub, hashComparatorStub, tokenGeneratorStub }
  }

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve) => resolve(null)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparator with correct values', async () => {
    const { sut, hashComparatorStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparatorStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should throw if HashComparator throws', async () => {
    const { sut, hashComparatorStub } = makeSut()
    jest.spyOn(hashComparatorStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparator returns false', async () => {
    const { sut, hashComparatorStub } = makeSut()
    jest.spyOn(hashComparatorStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve) => resolve('token')))
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })
})
