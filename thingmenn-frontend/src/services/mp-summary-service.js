import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpSummaryService extends CacheService {
  getMpVoteSummary(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/votes/mp/${mpId}`)
  }

  getMpSpeechSummary(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/speeches/mp/${mpId}`)
  }

  getMpDocumentSummary(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/votes/mp/${mpId}`)
  }
 
  getMpVoteSummaryByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/summary/votes/mp/${mpId}`)
  }

  getMpSpeechSummaryByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/summary/speeches/mp/${mpId}`)
  }

  getMpDocumentSummaryByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/summary/documents/mp/${mpId}`)
  }

  getMpVotePositions(mpId) {
    return this.fetchData(`${apiUrl}/api/positions/votes/mp/${mpId}`)
  }

  getMpSpeechPositions(mpId) {
    return this.fetchData(`${apiUrl}/api/positions/speeches/mp/${mpId}`)
  }

  getMpDocumentPositions(mpId) {
    return this.fetchData(`${apiUrl}/api/positions/votes/mp/${mpId}`)
  }
 
  getMpVotePositionsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/positions/votes/mp/${mpId}`)
  }

  getMpSpeechPositionsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/positions/speeches/mp/${mpId}`)
  }

  getMpDocumentPositionsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/positions/votes/mp/${mpId}`)
  }
}

export default new MpSummaryService()
