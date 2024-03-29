import bcrypt from 'bcryptjs'
import { HashComparator } from '@/data/protocols/criptography/hash-comparator'
import { Hasher } from '@/data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher, HashComparator {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
