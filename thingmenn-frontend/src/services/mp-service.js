import 'whatwg-fetch'
import { apiUrl } from '../config'

let instance = null

const urls = {
  all: `${apiUrl}/api/mps`,
  details: `${apiUrl}/api/mps`
}

const timeToFlushCache = 30 * 3600 // 30 minutes

class MpService {
  constructor() {
    if (!instance) {
      instance = this
      instance.cache = {}
    }

    return instance
  }

  fetchData(url) {
    return new Promise((resolve, reject) => {
      const cached = instance.getKeyFromCache[url]
      if (cached) {
        resolve(cached)
      } else {
        return fetch(url)
          .then(response => {
            return response.json()
          }).then(jsonData => {
            instance.setKeyToCache(url, jsonData)
            resolve(jsonData)
          })
      }
    })
  }

  getKeyFromCache(key) {
    const cached = instance.cache[key]
    if (cached) {
      const now = new Date().getTime()
      const diff = now - cached.time
      if (diff < timeToFlushCache) {
        console.log(`Cache hit: ${key} | diff: ${diff}`)
        return cached.data
      } else {
        console.log(`Cache flush: ${key} | diff is ${diff}`)
        instance.cache[key] = undefined
      }
    } else {
      console.log(`Cache miss: ${key}`)
    }
    return null
  }

  setKeyToCache(key, data) {
    const time = new Date().getTime()
    console.log(`Cache insert: ${key} | time is ${time}`)
    instance.cache[key] = {
      time,
      data,
    }
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
