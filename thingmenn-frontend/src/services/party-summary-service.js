import { apiUrl } from '../config'
import CacheService from './cache-service'

class PartySummaryService extends CacheService {
  getPartyVoteSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/votes/party/${mpId}`,
    )
  }

  getPartySpeechSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/speeches/party/${mpId}`,
    )
  }

  getPartyDocumentSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/documents/party/${mpId}`,
    )
  }

  getPartyVotePositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/votes/party/${mpId}`,
    )
  }

  getPartySpeechPositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/speeches/party/${mpId}`,
    )
  }

  getPartyDocumentPositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/documents/party/${mpId}`,
    )
  }
}

export default new PartySummaryService()
