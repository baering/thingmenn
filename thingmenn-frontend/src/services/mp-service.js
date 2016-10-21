import { apiUrl } from '../config'
import CacheService from './cache-service'

let instance = null

const urls = {
  all: `${apiUrl}/api/mps`,
  details: `${apiUrl}/api/mps`
}

class MpService extends CacheService {
  constructor() {
    super()
    if (!instance) {
      instance = this
    }

    return instance
  }

  getMpsIfCached() {
    let cached = instance.getKeyFromCache(urls.all)
    return cached ? cached : []
  }

  getMps() {
    return new Promise((resolve, reject) => {
      const url = urls.all
      instance.fetchData(url).then(mps => {
        resolve(mps)
      }).catch(error => reject(error))
    })
  }

  getMpDetailsIfCached(mpId) {
    const url = `${urls.details}/${mpId}`
    let cached = instance.getKeyFromCache(url)
    return cached ? cached : {}
  }

  getMpDetails(mpId) {
    const url = `${urls.details}/${mpId}`
    return new Promise((resolve, reject) => {
      instance.fetchData(url).then(mp => {
        resolve(mp)
      }).catch(error => reject(error))
    })
  }
}

export default MpService
