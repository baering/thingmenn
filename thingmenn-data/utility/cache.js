import fs from 'fs'
import { getDir } from './file'

let hasValidatedIfCacheDirExists = false

const createHash = (str) => {
  return str.replace('http://www.althingi.is/', '').replace(/\/$/, '')
}

const createCachePath = (key) => {
  return `./__cache__/${key}`
}

export function setToCache(url, data) {
  const urlCacheKey = createHash(url)

  const cachePath = createCachePath(urlCacheKey)
  const dir = getDir(cachePath)

  if (!hasValidatedIfCacheDirExists || !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    hasValidatedIfCacheDirExists = true
  }

  fs.writeFileSync(`${cachePath}`, data)
}

export function getFromCache(url) {
  const urlCacheKey = createHash(url)
  console.log('getFromCache', urlCacheKey)

  try {
    const filePath = createCachePath(urlCacheKey)
    const inFileStorage = fs.readFileSync(`${filePath}`, 'utf8')

    if (inFileStorage) {
      return inFileStorage
    }
  } catch (e) {}

  return null
}
