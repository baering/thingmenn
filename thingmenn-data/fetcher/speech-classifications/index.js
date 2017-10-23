import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import {
  urlForSpeeches,
} from '../urls'

function parseSpeeches(xml, lthing) {
  return xml.ræðulisti.ræða.map(speech => {
    const mp = speech.ræðumaður[0]
    const referencedCase = speech.mál[0]

    return {
      mp: {
        id: parseInt(mp.$.id, 10),
      },
      case: {
        id: parseInt(referencedCase.málsnúmer, 10),
        category: referencedCase.málsflokkur,
        lthing,
      },
    }
  })
}

async function fetchSpeechesForLthing(lthing) {
  const url = urlForSpeeches(lthing)
  const xml = await fetchXml(url)
  return parseSpeeches(xml, lthing)
}

async function fetch(lthings) {
  if (!lthings) {
    throw new Error('missing lthings for speech classification fetcher')
  }

  const speechesWithClassificationByLthing = {}

  for (const lthing of lthings) {
    const speechesWithClassifications = await fetchSpeechesForLthing(lthing)
    speechesWithClassificationByLthing[lthing] = speechesWithClassifications
  }

  writeToFile(speechesWithClassificationByLthing, 'data/v2/speech-classifications-by-lthing.json', true)
}

export default fetch
