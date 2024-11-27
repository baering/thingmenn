import { dataPath, defaultPeriodId } from '../config'
import CacheService from './cache-service'

class MpSummaryService extends CacheService {
  getMpVoteSummaryByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(`${dataPath}/mps/${lthing}/${mpId}/vote-summary.json`)
  }

  getMpSpeechSummaryByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/speech-summary.json`,
    )
  }

  getMpDocumentSummaryByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/document-summary.json`,
    )
  }

  getMpAbsentSummaryByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/absent-summary.json`,
    )
  }

  getMpVotePositionsByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/vote-positions.json`,
    )
  }

  getMpSpeechPositionsByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/speech-positions.json`,
    )
  }

  getMpDocumentPositionsByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/document-positions.json`,
    )
  }
}

export default new MpSummaryService()
