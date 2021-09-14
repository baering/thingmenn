import { apiUrl } from '../config'
import CacheService from './cache-service'
import getPath from '../utility/get-path'

class PartySummaryService extends CacheService {
  getPartyVoteSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/votes/party/${mpId}`,
    )
  }

  getPartySpeechSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/speeches/party/${mpId}`,
    )
  }

  getPartyDocumentSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/documents/party/${mpId}`,
    )
  }

  getPartyAbsentSummary(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/summary/absent/party/${mpId}`,
    )
  }

  getPartyVotePositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/votes/party/${mpId}`,
    )
  }

  getPartySpeechPositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/speeches/party/${mpId}`,
    )
  }

  getPartyDocumentPositions(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/positions/documents/party/${mpId}`,
    )
  }
}

export default new PartySummaryService()
