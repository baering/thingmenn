import { writeToFile } from '../utility/file'
import { getProcessArguments } from '../utility/process'

import fetchMps from './mps'
import fetchLthings from './lthings'
import fetchVotes from './votes'
import fetchClassifications from './classifications'
import fetchSpeechStatistics from './speech-statistics'
import fetchDocuments from './documents'
import fetchSpeechClassifications from './speech-classifications'

const defaultItems = [
  'classifications',
  'documents',
  'mps',
  'lthings',
  'speechClassifications',
  'speechStatistics',
  'votes',
]
const lthings = [147, 146, 145, 144, 143, 142, 141, 140, 139, 138, 137, 136, 135]

async function fetch(config) {
  if (config.mps) {
    console.log('Fetching mps')
    await fetchMps(lthings)
  }

  if (config.lthings) {
    console.log('Fetching lthings')
    await fetchLthings(lthings)
    writeToFile(lthings, 'data/v2/lthings-used.json', true)
  }

  if (config.votes) {
    console.log('Fetching votes')
    await fetchVotes(lthings)
  }

  if (config.classifications) {
    console.log('Fetching classifications')
    await fetchClassifications()
  }

  if (config.speechStatistics) {
    console.log('Fetching speech statistics')
    await fetchSpeechStatistics(lthings)
  }

  if (config.speechClassifications) {
    console.log('Fetching speech classifications')
    await fetchSpeechClassifications(lthings)
  }

  if (config.documents) {
    console.log('Fetching documents')
    await fetchDocuments(lthings)
  }
}

const itemsToFetch = getProcessArguments(defaultItems)
fetch(itemsToFetch)
