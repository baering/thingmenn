// import { writeToFile } from '../utility/file'
import { getProcessArguments } from '../utility/process'

import fetchMps from './mps'
import fetchVotes from './votes'
import fetchSubjects from './subjects'
import fetchSpeechStatistics from './speech-statistics'
// TODO: add analyzer to the repo
// import fetchSpeeches from './speeches'

const defaultItems = ['mps', 'votes', 'subjects', 'speechStatistics', 'speeches']
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

  if (config.subjects) {
    console.log('Fetching subjects')
    await fetchSubjects()
  }

  if (config.speechStatistics) {
    console.log('Fetching speech statistics')
    await fetchSpeechStatistics()
  }

  if (config.speeches) {
    // TODO: add analyzer to the repo
    console.log('Would be speeches, but needs analyzer')
    // const speeches = await fetchSpeeches()
    // writeToFile(data, 'data/all-votes-for-term.json')
  }
}

const itemsToFetch = getProcessArguments(defaultItems)
fetch(itemsToFetch)
