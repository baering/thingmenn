import { dataPath } from '../config'
import CacheService from './cache-service'

class TotalsService extends CacheService {
  getLthings() {
    return this.fetchData(`${dataPath}/periods/list.json`).then((result) =>
      result.filter((period) => {
        const { id, start, end } = period

        if (!id || (!start && !end)) {
          return false
        }

        return true
      }),
    )
  }

  getTopMpsAttendanceByLthing(lthing) {
    return this.fetchData(`${dataPath}/mps/${lthing}/top-attendance.json`).then(
      (result) => result.slice(0, 10),
    )
  }

  getBottomMpsAttendanceByLthing(lthing) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/bottom-attendance.json`,
    ).then((result) => result.slice(0, 10))
  }

  getTopMpsStandsByLthing(lthing) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/top-stands-taken.json`,
    ).then((result) => result.slice(0, 10))
  }

  getBottomMpsStandsByLthing(lthing) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/bottom-stands-taken.json`,
    ).then((result) => result.slice(0, 10))
  }

  getTopMpsMinutesByLthing(lthing) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/top-minutes-talked.json`,
    ).then((result) => result.slice(0, 10))
  }

  getBottomMpsMinutesByLthing(lthing) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/top-minutes-talked.json`,
    ).then((result) => result.reverse().slice(0, 10))
  }
}

export default new TotalsService()
