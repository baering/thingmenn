import { apiUrl } from '../config'
import CacheService from './cache-service'

let instance = null

class PartySummaryService extends CacheService {
  constructor() {
    super()

    if (!instance) {
      instance = this
    }

    return instance
  }

  getPartyVotesIfCached(partyId) {
    const url = `${apiUrl}/api/summary/votes/party/${partyId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : {
      voteSummary: {},
      votePercentages: {},
    }
  }

  getPartyVotes(partyId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/votes/party/${partyId}`
      instance.fetchData(url).then(partyVotes => {
        resolve(partyVotes)
      }).catch(error => reject(error))
    })
  }

  getPartySubjectsIfCached(partyId) {
    const url = `${apiUrl}/api/summary/subjects/party/${partyId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getPartySubjects(partyId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/subjects/party/${partyId}`
      instance.fetchData(url).then(partySubjects => {
        resolve(partySubjects)
      }).catch(error => reject(error))
    })
  }

  getPartySpeechesIfCached(partyId) {
    const url = `${apiUrl}/api/summary/speeches/party/${partyId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : {}
  }

  getPartySpeeches(partyId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/speeches/party/${partyId}`
      instance.fetchData(url).then(partySpeeches => {
        resolve(partySpeeches)
      }).catch(error => reject(error))
    })
  }

  getPartyNounsIfCached(partyId) {
    const url = `${apiUrl}/api/summary/nouns/party/${partyId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getPartyNouns(partyId) {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/summary/nouns/party/${partyId}`
      instance.fetchData(url).then(partyNouns => {
        resolve(partyNouns)
      }).catch(error => reject(error))
    })
  }
}

export default PartySummaryService
