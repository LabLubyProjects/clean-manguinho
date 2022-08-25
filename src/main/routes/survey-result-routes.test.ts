// import { hash } from 'bcryptjs'
// import { sign } from 'jsonwebtoken'
// import { Collection } from 'mongodb'
import request from 'supertest'
// import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
// import env from '../config/env'

// let surveyCollection: Collection
// let accountCollection: Collection

// const makeAccessToken = async (): Promise<string> => {
//   const password = await hash('123', 12)
//   const { insertedId } = await accountCollection.insertOne({
//     name: 'name',
//     email: 'name@mail.com',
//     password,
//     role: 'admin'
//   })
//   const accessToken = sign({ id: insertedId.toString() }, env.jwtSecret)
//   await accountCollection.updateOne({
//     _id: insertedId
//   }, {
//     $set: {
//       accessToken
//     }
//   })
//   return accessToken
// }

describe('Survey Routes', () => {
  // beforeAll(async () => {
  //   await MongoHelper.connect(`${process.env.MONGO_URL}`)
  // })

  // beforeEach(async () => {
  //   surveyCollection = MongoHelper.getCollection('surveys')
  //   await surveyCollection.deleteMany({})
  //   accountCollection = MongoHelper.getCollection('accounts')
  //   await accountCollection.deleteMany({})
  // })

  // afterAll(async () => {
  //   await MongoHelper.disconnect()
  // })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })
  })
})
