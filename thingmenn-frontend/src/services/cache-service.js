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
          }).catch(error => reject(error))
      }
    })
  }

  getKeyFromCache(key) {
    const cached = this.cache[key]
    if (cached) {
      const now = new Date().getTime()
      const diff = now - cached.time
      if (diff < timeToFlushCache) {
        return cached.data
      } else {
        this.cache[key] = undefined
      }
    }
    return null
  }

  setKeyToCache(key, data) {
    const time = new Date().getTime()

    this.cache[key] = {
      time,
      data,
    }
  }
}

export default CacheService
