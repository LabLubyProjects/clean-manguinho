import { Collection, MongoClient, ObjectId } from 'mongodb'

export const MongoHelper = {
  client: null as unknown as MongoClient,
  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  },
  getCollection (name: string): Collection {
    return this.client.db().collection(name)
  },
  map (id: ObjectId, data: any): any {
    return { id: id.toString(), ...data }
  },
  mapCollection (collection: any[]): any[] {
    return collection.map((col) => MongoHelper.map(col._id, col))
  }
}
