import { Decrypter } from '../protocols/criptography/decrypter'
import { Encrypter } from '../protocols/criptography/encrypter'
import { HashComparator } from '../protocols/criptography/hash-comparator'
import { Hasher } from '../protocols/criptography/hasher'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'any_token'
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'token'
    }
  }
  return new EncrypterStub()
}

export const mockHashComparator = (): HashComparator => {
  class HashComparatorStub implements HashComparator {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparatorStub()
}
