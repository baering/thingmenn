import { apiUrl } from '../config'
import CacheService from './cache-service'

class MpService extends CacheService {
  getMps() {
    return this.fetchData(`${apiUrl}/api/mps`)
  }

  getMpDetails(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}`)
  }

  getSimilarMps(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}/similar`)
  }

  getDifferentMps(mpId) {
    return this.fetchData(`${apiUrl}/api/mps/${mpId}/different`)
  }
}

export default new MpService()
