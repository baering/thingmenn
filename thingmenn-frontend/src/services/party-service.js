import { apiUrl } from '../config'
import CacheService from './cache-service'

class PartyService extends CacheService {
  getPartiesByLthing(lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/parties`)
  }

  getPartyDetailsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/parties/${mpId}`)
  }
}

export default new PartyService()
