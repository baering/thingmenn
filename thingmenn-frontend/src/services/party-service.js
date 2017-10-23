import { apiUrl } from '../config'
import CacheService from './cache-service'

class PartyService extends CacheService {
  getPartiesByLthing(lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/parties`)
  }

  getPartyDetailsByLthing(partyId, lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/parties/${partyId}`)
  }
}

export default new PartyService()
