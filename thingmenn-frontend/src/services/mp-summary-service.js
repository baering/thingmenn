import { apiUrl } from '../config'
import CacheService from './cache-service'
import getPath from '../utility/get-path'

class MpSummaryService extends CacheService {
  getMpVoteSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/votes/mp/${mpId}`,
    )
  }

  getMpSpeechSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/speeches/mp/${mpId}`,
    )
  }

  getMpDocumentSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/documents/mp/${mpId}`,
    )
  }

  getMpAbsentSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/absent/mp/${mpId}`,
    )
  }

  getMpVotePositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/votes/mp/${mpId}`,
    )
  }

  getMpSpeechPositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/speeches/mp/${mpId}`,
    )
  }

  getMpDocumentPositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/documents/mp/${mpId}`,
    )
  }
}

export default new MpSummaryService()
