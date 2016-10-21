import { apiUrl } from '../config'
import CacheService from './cache-service'

let instance = null

class MpService extends CacheService {
  constructor() {
    super()
    if (!instance) {
      instance = this
    }

    return instance
  }

  getMpsIfCached() {
    const url = `${apiUrl}/api/mps`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getMps() {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/api/mps`
      instance.fetchData(url).then(mps => {
        resolve(mps)
      }).catch(error => reject(error))
    })
  }

  getMpDetailsIfCached(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : {}
  }

  getMpDetails(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}`
    return new Promise((resolve, reject) => {
      instance.fetchData(url).then(mp => {
        resolve(mp)
      }).catch(error => reject(error))
    })
  }

  getSimilarMpsIfCached(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}/similar`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getSimilarMps(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}/similar`
    return new Promise((resolve, reject) => {
      instance.fetchData(url).then(mp => {
        resolve(mp)
      }).catch(error => reject(error))
    })
  }

  getDifferentMpsIfCached(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}/different`
    const cached = instance.getKeyFromCache(url)
    return cached ? cached : []
  }

  getDifferentMps(mpId) {
    const url = `${apiUrl}/api/mps/${mpId}/different`
    return new Promise((resolve, reject) => {
      instance.fetchData(url).then(mp => {
        resolve(mp)
      }).catch(error => reject(error))
    })
  }
}

export default MpService
