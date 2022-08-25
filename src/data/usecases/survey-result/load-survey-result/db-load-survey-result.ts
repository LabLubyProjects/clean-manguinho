import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-respository'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result copy'
import { SurveyResultModel } from '../save-survey-result/db-save-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: string): Promise<SurveyResultModel | null> {
    await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    return null
  }
}
