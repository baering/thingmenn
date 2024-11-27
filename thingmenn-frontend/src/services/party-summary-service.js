import { dataPath, defaultPeriodId } from '../config'
import CacheService from './cache-service'

class PartySummaryService extends CacheService {
  getPartyVoteSummaryByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/vote-summary.json`,
    )
  }

  getPartySpeechSummaryByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/speech-summary.json`,
    )
  }

  getPartyDocumentSummaryByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/document-summary.json`,
    )
  }

  getPartyAbsentSummaryByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/absent-summary.json`,
    )
  }

  getPartyVotePositionsByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/vote-positions.json`,
    )
  }

  getPartySpeechPositionsByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/speech-positions.json`,
    )
  }

  getPartyDocumentPositionsByLthing(partyId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/parties/${lthing}/${partyId}/document-positions.json`,
    )
  }
}

export default new PartySummaryService()
