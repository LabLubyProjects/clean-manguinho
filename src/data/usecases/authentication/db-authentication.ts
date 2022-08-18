import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparator } from '../../protocols/criptography/hash-comparator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashComparator: HashComparator

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashComparator: HashComparator) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashComparator = hashComparator
  }

  async auth (authentication: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      await this.hashComparator.compare(authentication.password, account.password)
    }
    return null
  }
}
