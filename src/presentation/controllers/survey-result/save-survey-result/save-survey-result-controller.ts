import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveysById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const survey = await this.loadSurveysById.loadById(httpRequest.params.surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))
    return ok(survey)
  }
}
