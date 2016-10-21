import 'whatwg-fetch'
import { apiUrl } from '../config'

let instance = null

const urls = {
  all: `${apiUrl}/api/mps`
}

class MpService {
  constructor() {
    if (!instance) {
      instance = this
      instance.cache = {}
    }

    return instance
  }

  fetchData(url) {
    return fetch(url)
      .then(response => {
        return response.json()
      })
  }

  getMpsIfCached() {
    let cached = instance.cache[urls.all]
    if (!cached) {
      cached = []
    }
    return cached
  }

  getMps() {
    return new Promise((resolve, reject) => {
      const url = urls.all
      const cached = instance.cache[url]
      if (cached) {
        resolve(cached)
      } else {
        instance.fetchData(url).then(mps => {
          instance.cache[url] = mps
          resolve(mps)
        }).catch(error => reject(error))
      }
    })
  }
}

export default MpService
