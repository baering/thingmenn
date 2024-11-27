import { dataPath, defaultPeriodId } from '../config'
import CacheService from './cache-service'

class MpService extends CacheService {
  getMpsByLthing(lthing = defaultPeriodId) {
    return this.fetchData(`${dataPath}/mps/${lthing}/list.json`)
  }

  getMpDetails(mpId) {
    return this.fetchData(`${dataPath}/mps/list.json`)
      .then((mps) => mps.find((mp) => Number(mp.id) === Number(mpId)))
      .then((mp) => {
        return {
          ...mp,
          description: {
            ...mp.description,
            asMp: mp.description.asMp.replace(/&ndash;/g, '-'),
            asPerson: mp.description.asPerson.replace(/&ndash;/g, '-'),
          },
        }
      })
  }

  getSimilarMpsByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/similar-votes.json`,
    )
  }

  getDifferentMpsByLthing(mpId, lthing = defaultPeriodId) {
    return this.fetchData(
      `${dataPath}/mps/${lthing}/${mpId}/different-votes.json`,
    )
  }
}

export default new MpService()
