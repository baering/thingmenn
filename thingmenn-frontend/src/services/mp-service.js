import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpService extends CacheService {
  getMps() {
    return this.fetchData(`${apiUrl}/api/mps`)
  }

  getMpsByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps`)
  }

  getMpDetails(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}`)
  }

  getMpDetailsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps/${mpId}`)
  }

  getSimilarMps(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}/similar`)
  }

  getSimilarMpsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps/${mpId}/similar`)
  }

  getDifferentMps(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}/different`)
  }

  getDifferentMpsByLthing(mpId, lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps/${mpId}/different`)
  }
}

export default new MpService()
