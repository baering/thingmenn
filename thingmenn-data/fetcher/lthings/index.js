import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import { urlForLthings } from '../urls'

function parseLthing(xml) {
  return {
    id: xml.$.númer,
    duration: xml.tímabil[0],
    start: xml.þingsetning[0],
    end: xml.þinglok ? xml.þinglok[0] : '',
  }
}

function parseLthings(xml) {
  return xml.löggjafarþing.þing.map((lthing) => parseLthing(lthing))
}

async function fetchLthings() {
  const url = urlForLthings()
  const xml = await fetchXml(url)
  return parseLthings(xml)
}

async function fetch() {
  const lthings = await fetchLthings()
  writeToFile(lthings, 'data/v2/lthings.json', true)
}

export default fetch
