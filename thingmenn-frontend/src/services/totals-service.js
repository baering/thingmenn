import { apiUrl } from '../config'
import CacheService from './cache-service'
import getPath from '../utility/get-path'

class TotalsService extends CacheService {
  getLthings() {
    return this.fetchData(`${apiUrl}/api/lthings`)
  }

  getTerms() {
    return this.fetchData(`${apiUrl}/api/terms`)
  }

  getTopMpsAttendance(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/top/attendance/mps`)
  }

  getBottomMpsAttendance(params) {
    return this.fetchData(
      `${apiUrl}/api/${getPath(params)}/bottom/attendance/mps`,
    )
  }

  getTopMpsStands(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/top/stands/mps`)
  }

  getBottomMpsStands(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/bottom/stands/mps`)
  }

  getTopMpsMinutes(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/top/minutes/mps`)
  }

  getBottomMpsMinutes(params) {
    return this.fetchData(`${apiUrl}/api/${getPath(params)}/bottom/minutes/mps`)
  }
}

export default new TotalsService()
