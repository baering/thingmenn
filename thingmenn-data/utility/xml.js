import axios from 'axios'

import { parseString } from 'xml2js'
import { getFromCache, setToCache } from './cache'

function parseXmlPromiseWrapper(xml) {
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export async function fetchXml(url, shouldCache = true) {
  if (shouldCache) {
    const cached = getFromCache(url)

    if (cached) {
      return await parseXmlPromiseWrapper(cached)
    }
  }

  let tries = 0
  let xml = undefined

  while (xml === undefined) {
    try {
      if (tries >= 4) {
        break
      }
      xml = await axios.get(url)
      tries += 1
    } catch (e) {
      console.log(`Failed to fetch ${url}. Retrying (#${tries})`)

      await new Promise((resolve) => setTimeout(resolve, 500 * tries))

      tries += 1
    }
  }
  const result = await parseXmlPromiseWrapper(xml.data)

  if (shouldCache) {
    setToCache(url, xml.data)
  }
  return result
}
