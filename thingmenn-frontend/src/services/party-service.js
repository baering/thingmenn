import { apiUrl } from '../config'
import CacheService from './cache-service'
import getPath from '../utility/get-path'

class PartyService extends CacheService {
  getParties(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/parties`)
  }

  getPartyDetails(partyId, params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/parties/${partyId}`)
  }
}

export default new PartyService()
