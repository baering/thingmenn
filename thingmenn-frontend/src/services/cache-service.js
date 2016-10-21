import 'whatwg-fetch'

const timeToFlushCache = 30 * 3600 // 30 minutes

class CacheService {
  constructor() {
    this.cache = {}
  }

  fetchData(url) {
    return new Promise((resolve, reject) => {
      const cached = this.getKeyFromCache[url]
      if (cached) {
        resolve(cached)
      } else {
        return fetch(url)
          .then(response => {
            return response.json()
          }).then(jsonData => {
            this.setKeyToCache(url, jsonData)
            resolve(jsonData)
          })
      }
    })
  }

  getKeyFromCache(key) {
    const cached = this.cache[key]
    if (cached) {
      const now = new Date().getTime()
      const diff = now - cached.time
      if (diff < timeToFlushCache) {
        console.log(`Cache hit: ${key} | diff: ${diff}`)
        return cached.data
      } else {
        console.log(`Cache flush: ${key} | diff is ${diff}`)
        this.cache[key] = undefined
      }
    } else {
      console.log(`Cache miss: ${key}`)
    }
    return null
  }

  setKeyToCache(key, data) {
    const time = new Date().getTime()
    console.log(`Cache insert: ${key} | time is ${time}`)
    this.cache[key] = {
      time,
      data,
    }
  }
}

export default CacheService
