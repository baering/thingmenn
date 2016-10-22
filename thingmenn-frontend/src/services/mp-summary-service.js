import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpSummaryService extends CacheService {
  getMpVotes(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/votes/mp/${mpId}`)
  }

  getMpSubjects(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/subjects/mp/${mpId}`)
  }

  getMpSpeeches(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/speeches/mp/${mpId}`)
  }

  getMpNouns(mpId) {
    return this.fetchData(`${apiUrl}/api/summary/nouns/mp/${mpId}`)
  }
}

export default new MpSummaryService()
