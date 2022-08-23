import { hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import env from '../config/env'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(`${process.env.MONGO_URL}`)
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app).post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image.com'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add survey with valid accessToken', async () => {
      const password = await hash('123', 12)
      const { insertedId } = await accountCollection.insertOne({
        name: 'name',
        email: 'name@mail.com',
        password,
        role: 'admin'
      })
      const accessToken = sign({ id: insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: insertedId
      }, {
        $set: {
          accessToken
        }
      })
      await request(app).post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://image.com'
          },
          {
            answer: 'Answer 2'
          }]
        })
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on load surveys without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 204 on load surveys with valid accessToken', async () => {
      const password = await hash('123', 12)
      const { insertedId } = await accountCollection.insertOne({
        name: 'name',
        email: 'name@mail.com',
        password
      })
      const accessToken = sign({ id: insertedId.toString() }, env.jwtSecret)
      await accountCollection.updateOne({
        _id: insertedId
      }, {
        $set: {
          accessToken
        }
      })
      await request(app).get('/api/surveys')
        .set('x-access-token', accessToken).expect(204)
    })
  })
})
