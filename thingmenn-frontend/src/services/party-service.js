import { dataPath, defaultPeriodId } from '../config'
import CacheService from './cache-service'

class PartyService extends CacheService {
  getAllParties() {
    return this.fetchData(`${dataPath}/parties/list.json`).then((p) =>
      p.filter((p) => p.id !== '44'),
    )
  }

  getPartiesByLthing(lthing = defaultPeriodId) {
    return this.fetchData(`${dataPath}/parties/${lthing}/list.json`)
  }

  getPartyDetailsByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(`${dataPath}/parties/list.json`).then((parties) =>
      parties.find((party) => Number(party.id) === Number(partyId)),
    )
  }
}

export default new PartyService()
