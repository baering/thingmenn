import { apiUrl } from '../config'
import CacheService from './cache-service'

class TotalsService extends CacheService {
  getLthings() {
    return this.fetchData(`${apiUrl}/api/lthings`)
  }

  getTopMpsAttendanceByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/top/attendance/mps`)
  }

  getBottomMpsAttendanceByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/bottom/attendance/mps`)
  }

  getTopMpsStandsByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/top/stands/mps`)
  }

  getBottomMpsStandsByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/bottom/stands/mps`)
  }

  getTopMpsMinutesByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/top/minutes/mps`)
  }

  getBottomMpsMinutesByLthing(lthing) {
    return this.fetchData(`${apiUrl}/api/lthing/${lthing}/bottom/minutes/mps`)
  }

}

export default new TotalsService()
