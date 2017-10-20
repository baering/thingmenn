import { getProcessArguments } from '../utility/process'

import fetchMps from './mps'
import fetchVotes from './votes'
import fetchClassifications from './classifications'
import fetchSpeechStatistics from './speech-statistics'
// TODO: add analyzer to the repo
// import fetchSpeeches from './speeches'
import fetchDocuments from './documents'
import fetchSpeechClassifications from './speech-classifications'

const defaultItems = [
  'classifications',
  'documents',
  'mps',
  'speechClassifications',
  'speeches',
  'speechStatistics',
  'votes',
]
const lthings = [145, 144, 143]

async function fetch(config) {
  if (config.mps) {
    console.log('Fetching mps')
    await fetchMps(lthings)
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

  if (config.speeches) {
    // TODO: add analyzer to the repo
    console.log('Would be speeches, but needs analyzer')
    // const speeches = await fetchSpeeches()
    // writeToFile(data, 'data/all-votes-for-term.json')
  }

  if (config.documents) {
    console.log('Fetching documents')
    await fetchDocuments(lthings)
  }
}

const itemsToFetch = getProcessArguments(defaultItems)
fetch(itemsToFetch)
