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

export async function fetchXml(url) {
  if (cache[url]) {
    console.log(`fetchXml (cached):\t${url}`)
    return cache[url]
  }
  const xml = await axios.get(url)
  const result = await parseXmlPromiseWrapper(xml.data)

  cache[url] = result

  console.log(`fetchXml (requested)\t${url}`)
  return result
}
