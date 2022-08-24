import { SurveyResultModel } from '../models/survey-result'

export interface AddSurveyResultModel {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export interface SaveSurveyResult {
  save: (data: AddSurveyResultModel) => Promise<SurveyResultModel>
}
