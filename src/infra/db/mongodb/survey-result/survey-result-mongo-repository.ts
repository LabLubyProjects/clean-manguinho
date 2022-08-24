import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usecases/save-survey-result/db-save-survey-result-protocols'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = MongoHelper.getCollection('surveyResults')
    const survey = await surveyResultCollection.findOne<any>({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    })

    let id: ObjectId

    if (survey) {
      await surveyResultCollection.updateOne({
        surveyId: new ObjectId(data.surveyId),
        accountId: new ObjectId(data.accountId)
      },
      {
        $set: {
          answer: data.answer,
          date: data.date
        }
      })
      id = survey._id
    } else {
      const insertResult = await surveyResultCollection.insertOne({
        accountId: data.accountId,
        surveyId: data.surveyId,
        answer: data.answer,
        date: data.date
      })
      id = insertResult.insertedId
    }
    const surveyResult: SurveyResultModel = await surveyResultCollection.findOne<any>({ _id: id })
    return surveyResult && MongoHelper.map(id, surveyResult)
  }
}
