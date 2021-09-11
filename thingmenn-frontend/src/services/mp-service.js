import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpService extends CacheService {
  getMpsByLthing(lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps`)
  }

  getMpDetailsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps/${mpId}`)
  }

  getSimilarMpsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/mps/${mpId}/similar`)
  }

  getDifferentMpsByLthing(mpId, lthing = 'allt') {
    return this.fetchData(
      `${apiUrl}/api/lthing/${lthing}/mps/${mpId}/different`,
    )
  }
}

export default new MpService()
