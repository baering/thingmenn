import { apiUrl } from '../config'
import CacheService from './cache-service'
import getPath from '../utility/get-path'

class MpService extends CacheService {
  getMps(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/mps`)
  }

  getMpDetails(mpId, params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/mps/${mpId}`)
  }

  getSimilarMps(mpId, params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/mps/${mpId}/similar`)
  }

  getDifferentMps(mpId, params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/mps/${mpId}/different`,
    )
  }
}

export default new MpService()
