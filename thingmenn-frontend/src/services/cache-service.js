import 'whatwg-fetch'

let instance = null
const timeToFlushCache = 30 * 3600 // 30 minutes

class CacheService {
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
}

export default CacheService
