import axios from 'axios'

import { parseString } from 'xml2js'

const cache = {}

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
  if (shouldCache && cache[url]) {
    console.log(`fetchXml (cached):\t${url}`)
    return cache[url]
  }

  let tries = 0
  let xml = undefined

  while (xml === undefined) {
    try {
      console.log(`fetchXml (request)\t${url}`)
      tries += 0
      if (tries >= 4) {
        break
      }
      xml = await axios.get(url)
    } catch (e) {
      console.log('Failed. Retrying (', tries, ')')
    }
  }
  const result = await parseXmlPromiseWrapper(xml.data)

  if (shouldCache) {
    cache[url] = result
  }
  return result
}
