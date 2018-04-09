import { fetchXml } from '../../utility/xml'
import { writeToFile } from '../../utility/file'
import {
  urlForSpeeches,
} from '../urls'
import { fetchExistingData } from '../utils'

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

  const resultFile = 'data/v2/speech-classifications-by-lthing.json'
  const existingData = fetchExistingData(resultFile, lthings, { resetCurrentLthings: true })

  const speechesWithClassificationByLthing = existingData || {}

  for (const lthing of lthings) {
    const speechesWithClassifications = await fetchSpeechesForLthing(lthing)
    speechesWithClassificationByLthing[lthing] = speechesWithClassifications
  }

  writeToFile(speechesWithClassificationByLthing, resultFile, true)
}

export default fetch
