import { apiUrl } from '../config'
import CacheService from './cache-service'

class PartyService extends CacheService {
  getParties() {
    return this.fetchData(`${apiUrl}/api/parties`)
  }

  getPartyDetails(partyId) {
    return this.fetchData(`${apiUrl}/api/parties/${partyId}`)
  }
}

export default new PartyService()
