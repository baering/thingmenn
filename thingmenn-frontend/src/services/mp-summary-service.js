import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpSummaryService extends CacheService {
  getMpVoteSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/votes/mp/${mpId}`,
    )
  }

  getMpSpeechSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/speeches/mp/${mpId}`,
    )
  }

  getMpDocumentSummaryByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/summary/documents/mp/${mpId}`,
    )
  }

  getMpVotePositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/votes/mp/${mpId}`,
    )
  }

  getMpSpeechPositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/speeches/mp/${mpId}`,
    )
  }

  getMpDocumentPositionsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/positions/documents/mp/${mpId}`,
    )
  }
}

export default new MpSummaryService()
