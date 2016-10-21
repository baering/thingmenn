import { apiUrl } from '../config'
import CacheService from './cache-service'

let instance = null

class PartyService extends CacheService {
  constructor() {
    super()

    if (!instance) {
      instance = this
    }

    return instance
  }

  getPartiesIfCached() {
    const url = `${apiUrl}/api/parties`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getParties() {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/parties`
      instance.fetchData(url).then(parties => {
        resolve(parties)
      }).catch(error => reject(error))
    })
  }

  getPartyDetailsIfCached(partyId) {
    const url = `${apiUrl}/api/parties/${partyId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : {}
  }

  getPartyDetails(partyId) {
    const url = `${apiUrl}/api/parties/${partyId}`
    return new Promise((resolve, reject) => {
      instance.fetchData(url).then(party => {
        resolve(party)
      }).catch(error => reject(error))
    })
  }
}

export default PartyService
