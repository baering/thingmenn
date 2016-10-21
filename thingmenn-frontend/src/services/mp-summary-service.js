import { apiUrl } from '../config'
import CacheService from './cache-service'

let instance = null

class MpSummaryService extends CacheService {
  constructor() {
    super()

    if (!instance) {
      instance = this
    }

    return instance
  }

  getMpVotesIfCached(mpId) {
    const url = `${apiUrl}/api/summary/votes/mp/${mpId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : {
      voteSummary: {},
      votePercentages: {},
    }
  }

  getMpVotes(mpId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/votes/mp/${mpId}`
      instance.fetchData(url).then(mpVotes => {
        resolve(mpVotes)
      }).catch(error => reject(error))
    })
  }

  getMpSubjectsIfCached(mpId) {
    const url = `${apiUrl}/api/summary/subjects/mp/${mpId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getMpSubjects(mpId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/subjects/mp/${mpId}`
      instance.fetchData(url).then(mpSubjects => {
        resolve(mpSubjects)
      }).catch(error => reject(error))
    })
  }

  getMpSpeechesIfCached(mpId) {
    const url = `${apiUrl}/api/summary/speeches/mp/${mpId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getMpSpeeches(mpId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/speeches/mp/${mpId}`
      instance.fetchData(url).then(mpSpeeches => {
        resolve(mpSpeeches)
      }).catch(error => reject(error))
    })
  }

  getMpNounsIfCached(mpId) {
    const url = `${apiUrl}/api/summary/nouns/mp/${mpId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getMpNouns(mpId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/nouns/mp/${mpId}`
      instance.fetchData(url).then(mpNouns => {
        resolve(mpNouns)
      }).catch(error => reject(error))
    })
  }
}

export default MpSummaryService
