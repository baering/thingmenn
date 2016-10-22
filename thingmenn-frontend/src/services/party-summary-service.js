import { apiUrl } from '../config'
import CacheService from './cache-service'

class PartySummaryService extends CacheService {
  getPartyVotes(partyId) {
    return this.fetchData(`${apiUrl}/api/summary/votes/party/${partyId}`)
  }

  getPartySubjects(partyId) {
    return this.fetchData(`${apiUrl}/api/summary/subjects/party/${partyId}`)
  }

  getPartySpeeches(partyId) {
    return this.fetchData(`${apiUrl}/api/summary/speeches/party/${partyId}`)
  }

  getPartyNouns(partyId) {
    return this.fetchData(`${apiUrl}/api/summary/nouns/party/${partyId}`)
  }
}

export default new PartySummaryService()
