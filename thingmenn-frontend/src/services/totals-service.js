import { apiUrl } from '../config'
import CacheService from './cache-service'

class TotalsService extends CacheService {
  getTopMpsAttendance() {
    return this.fetchData(`${apiUrl}/api/top/attendance/mps`)
  }
  getBottomMpsAttendance() {
    return this.fetchData(`${apiUrl}/api/bottom/attendance/mps`)
  }
  getTopMpsStands() {
    return this.fetchData(`${apiUrl}/api/top/stands/mps`)
  }
  getBottomMpsStands() {
    return this.fetchData(`${apiUrl}/api/bottom/stands/mps`)
  }
}

export default new TotalsService()