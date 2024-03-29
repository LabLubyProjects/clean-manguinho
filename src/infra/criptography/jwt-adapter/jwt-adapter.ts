import { Encrypter } from '@/data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
import { Decrypter } from '@/data/protocols/criptography/decrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async decrypt (token: string): Promise<string | null> {
    const value: any = await jwt.verify(token, this.secret)
    return value
  }

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
